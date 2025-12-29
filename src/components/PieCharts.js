import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";

export function ResponseChart({ responses }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={responses}
          dataKey="count"
          nameKey="response"
          label
        />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
