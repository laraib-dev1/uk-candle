import { Card, CardContent } from "@/components/ui/Card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
}

export default function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h2 className="text-2xl font-semibold">{value}</h2>
        </div>
        {icon && <div className="text-orange-500 text-3xl">{icon}</div>}
      </CardContent>
    </Card>
  );
}
