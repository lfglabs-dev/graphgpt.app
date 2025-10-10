import { baseURL } from "@/baseUrl";
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

const getAppsSdkCompatibleHtml = async (baseUrl: string, path: string) => {
  const result = await fetch(`${baseUrl}${path}`);
  return await result.text();
};

type ContentWidget = {
  id: string;
  title: string;
  templateUri: string;
  invoking: string;
  invoked: string;
  html: string;
  description: string;
};

function widgetMeta(widget: ContentWidget) {
  return {
    "openai/outputTemplate": widget.templateUri,
    "openai/toolInvocation/invoking": widget.invoking,
    "openai/toolInvocation/invoked": widget.invoked,
    "openai/widgetAccessible": false,
    "openai/resultCanProduceWidget": true,
  } as const;
}

const handler = createMcpHandler(async (server) => {
  const html = await getAppsSdkCompatibleHtml(baseURL, "/");

  const contentWidget: ContentWidget = {
    id: "show_content",
    title: "Show Content",
    templateUri: "ui://widget/content-template.html",
    invoking: "Loading content...",
    invoked: "Content loaded",
    html: html,
    description: "Displays the homepage content",
  };

  const chartWidget: ContentWidget = {
    id: "visualize_graph",
    title: "Visualize Graph",
    templateUri: "ui://widget/content-template.html",
    invoking: "Rendering chart...",
    invoked: "Chart rendered",
    html: html,
    description: "Visualize data as charts using Recharts",
  };
  server.registerResource(
    "content-widget",
    contentWidget.templateUri,
    {
      title: contentWidget.title,
      description: contentWidget.description,
      mimeType: "text/html+skybridge",
      _meta: {
        "openai/widgetDescription": contentWidget.description,
        "openai/widgetPrefersBorder": true,
      },
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "text/html+skybridge",
          text: `<html>${contentWidget.html}</html>`,
          _meta: {
            "openai/widgetDescription": contentWidget.description,
            "openai/widgetPrefersBorder": true,
          },
        },
      ],
    })
  );

  // @ts-ignore
  server.registerTool(
    contentWidget.id,
    {
      title: contentWidget.title,
      description:
        "Fetch and display the homepage content with the name of the user",
      inputSchema: {
        name: z.string().describe("The name of the user to display on the homepage"),
      },
      _meta: widgetMeta(contentWidget),
    },
    async ({ name }) => {
      return {
        content: [
          {
            type: "text",
            text: name,
          },
        ],
        structuredContent: {
          name: name,
          timestamp: new Date().toISOString(),
        },
        _meta: widgetMeta(contentWidget),
      };
    }
  );

  // Visualize Graph tool using Recharts-compatible config
  // @ts-ignore
  server.registerTool(
    chartWidget.id,
    {
      title: chartWidget.title,
      description:
        "Render a chart inline. Supports line, bar, area, and pie charts.",
      inputSchema: {
        chartType: z
          .enum(["line", "bar", "area", "pie"]) as unknown as z.ZodTypeAny,
        data: z
          .array(
            z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()]))
          )
          .describe("Array of data points as objects"),
        xKey: z.string().optional().describe("x-axis key for cartesian charts"),
        yKeys: z.array(z.string()).optional().describe("y-axis series keys"),
        labelKey: z.string().optional().describe("label key for pie charts"),
        valueKey: z.string().optional().describe("value key for pie charts"),
        width: z.number().optional().describe("chart width in pixels (optional)"),
        height: z.number().optional().describe("chart height in pixels (optional)"),
        stacked: z.boolean().optional().describe("stack series for bar/area"),
        colors: z.array(z.string()).optional().describe("series colors hex or CSS"),
      },
      _meta: widgetMeta(chartWidget),
    },
    async (input) => {
      const {
        chartType,
        data,
        xKey,
        yKeys,
        labelKey,
        valueKey,
        width,
        height,
        stacked,
        colors,
      } = input as any;

      function inferKeysForCartesian() {
        const first = Array.isArray(data) && data.length > 0 ? data[0] : undefined;
        if (!first || typeof first !== "object") return { inferredXKey: undefined, inferredYKeys: [] };
        const keys = Object.keys(first);
        let inferredXKey = xKey ?? keys.find((k) => typeof (first as any)[k] === "string") ?? keys[0];
        const inferredYKeys = (yKeys && yKeys.length > 0)
          ? yKeys
          : keys.filter((k) => k !== inferredXKey && typeof (first as any)[k] === "number");
        return { inferredXKey, inferredYKeys } as const;
      }

      function inferKeysForPie() {
        const first = Array.isArray(data) && data.length > 0 ? data[0] : undefined;
        if (!first || typeof first !== "object") return { inferredLabelKey: undefined, inferredValueKey: undefined };
        const keys = Object.keys(first);
        const inferredLabelKey = labelKey ?? keys.find((k) => typeof (first as any)[k] === "string") ?? keys[0];
        const inferredValueKey = valueKey ?? keys.find((k) => typeof (first as any)[k] === "number") ?? keys[1];
        return { inferredLabelKey, inferredValueKey } as const;
      }

      const config: Record<string, any> = {
        chartType,
        data,
        width: width ?? 720,
        height: height ?? 360,
        stacked: Boolean(stacked),
        colors: colors ?? undefined,
      };

      if (chartType === "pie") {
        const { inferredLabelKey, inferredValueKey } = inferKeysForPie();
        config.labelKey = inferredLabelKey;
        config.valueKey = inferredValueKey;
      } else {
        const { inferredXKey, inferredYKeys } = inferKeysForCartesian();
        config.xKey = inferredXKey;
        config.yKeys = inferredYKeys;
      }

      return {
        content: [
          {
            type: "text",
            text: `Rendered a ${chartType} chart with ${Array.isArray(data) ? data.length : 0} points` ,
          },
        ],
        structuredContent: config,
        _meta: widgetMeta(chartWidget),
      };
    }
  );
});

export const GET = handler;
export const POST = handler;
