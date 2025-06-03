
interface LiveIndicatorProps {
  isLive: boolean;
  text?: string;
}

export const LiveIndicator = ({ isLive, text = "Live" }: LiveIndicatorProps) => {
  if (!isLive) return null;
  
  return (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      <span className="text-sm text-green-600 font-medium">{text}</span>
    </div>
  );
};
