"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  BarChart,
  AreaChart,
  PieChart,
  Line,
  Bar,
  Area,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

type ChartConfig = {
  chartType: "line" | "bar" | "area" | "pie";
  data: Array<Record<string, any>>;
  xKey?: string;
  yKeys?: string[];
  labelKey?: string;
  valueKey?: string;
  width?: number;
  height?: number;
  stacked?: boolean;
  colors?: string[];
};

export default function Home() {
  const [name, setName] = useState<string | null>(null);
  const [chartConfig, setChartConfig] = useState<ChartConfig | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!window.openai) {
      (window as any).openai = {};
    }

    let currentValue = (window as any).openai.toolOutput;

    Object.defineProperty((window as any).openai, "toolOutput", {
      get() {
        return currentValue;
      },
      set(newValue: any) {
        currentValue = newValue;
        if (newValue?.name) {
          setName(newValue.name);
        }
        if (newValue?.chartType) {
          setChartConfig(newValue as ChartConfig);
        }
      },
      configurable: true,
      enumerable: true,
    });

    if (currentValue?.name) {
      setName(currentValue.name);
    }

    if (currentValue?.chartType) {
      setChartConfig(currentValue as ChartConfig);
    }
  }, []);

  const colors = useMemo(() => {
    return (
      chartConfig?.colors ?? [
        "#2563eb",
        "#16a34a",
        "#f59e0b",
        "#ef4444",
        "#8b5cf6",
        "#0ea5e9",
      ]
    );
  }, [chartConfig]);

  function renderCartesianChart() {
    if (!chartConfig) return null;
    const { chartType, data, xKey, yKeys = [], stacked } = chartConfig;
    const common = (
      <>
        <CartesianGrid strokeDasharray="3 3" />
        {xKey ? <XAxis dataKey={xKey} /> : null}
        <YAxis />
        <Tooltip />
        <Legend />
      </>
    );

    if (chartType === "line") {
      return (
        <ResponsiveContainer width="100%" height={chartConfig.height ?? 360}>
          <LineChart data={data} margin={{ top: 16, right: 24, bottom: 0, left: 0 }}>
            {common}
            {yKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                dot={false}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === "bar") {
      return (
        <ResponsiveContainer width="100%" height={chartConfig.height ?? 360}>
          <BarChart data={data} margin={{ top: 16, right: 24, bottom: 0, left: 0 }}>
            {common}
            {yKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[index % colors.length]}
                stackId={stacked ? "a" : undefined}
                isAnimationActive={false}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      );
    }

    // area
    return (
      <ResponsiveContainer width="100%" height={chartConfig.height ?? 360}>
        <AreaChart data={data} margin={{ top: 16, right: 24, bottom: 0, left: 0 }}>
          {common}
          {yKeys.map((key, index) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[index % colors.length]}
              fill={colors[index % colors.length]}
              stackId={stacked ? "a" : undefined}
              isAnimationActive={false}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  function renderPieChart() {
    if (!chartConfig) return null;
    const { data, labelKey, valueKey } = chartConfig;
    if (!labelKey || !valueKey) return null;
    return (
      <ResponsiveContainer width="100%" height={chartConfig.height ?? 360}>
        <PieChart>
          <Tooltip />
          <Legend />
          <Pie data={data} nameKey={labelKey} dataKey={valueKey} label>
            {data.map((_, index) => (
              <Cell key={index} fill={colors[index % colors.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    );
  }

  function renderChart() {
    if (!chartConfig) return null;
    if (chartConfig.chartType === "pie") return renderPieChart();
    return renderCartesianChart();
  }

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          <li className="mb-2 tracking-[-.01em]">
            Welcome to the ChatGPT Apps SDK Next.js Starter
          </li>
          <li className="mb-2 tracking-[-.01em]">
            Name returned from tool call: {name ?? "..."}
          </li>
          <li className="mb-2 tracking-[-.01em]">
            MCP server path: <Link href="/mcp" className="underline">/mcp</Link>
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link  
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
          prefetch={false} href="/client-page" >
            Visit another page
          </Link>
          <a href="https://vercel.com/templates/ai/chatgpt-app-with-next-js" target="_blank" rel="noopener noreferrer" className="underline">
              Deploy on Vercel
            </a>
        </div>

        {chartConfig ? (
          <div className="w-full max-w-5xl mt-8">
            <h2 className="text-xl font-semibold mb-2">Chart</h2>
            <div className="w-full border rounded-md p-2">
              {renderChart()}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
