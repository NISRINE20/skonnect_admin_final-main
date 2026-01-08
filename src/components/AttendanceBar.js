import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import styled from "styled-components";

const ChartWrapper = styled.div`
  height: 400px;
  margin-top: 40px;
`;

export default function AttendanceChart({ data }) {
  return (
    <ChartWrapper>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="title" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="year_2024" fill="#f59e0b" name="2024" />
          <Bar dataKey="last_year" fill="#94a3b8" name="Last Year" />
          <Bar dataKey="current_year" fill="#2563eb" name="Current Year" />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
