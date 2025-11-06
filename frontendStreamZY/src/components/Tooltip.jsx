
export default function Tooltip({ text, children, width, direction, margin, changes }) {

  const toolWidth = width || "w-full";
  const toolDirection = direction || "top-full left-1/2 -translate-x-1/2";
  const toolMargin = margin || "mt-[25px]";
  const newChanges = changes || ""
  return (
    <div className="relative group inline-block">
      {children}
      <div className={`absolute ${toolDirection} ${toolMargin} mb-2 hidden group-hover:flex items-center justify-center px-2 py-2 dark:text-white bg-slate-200 dark:bg-[hsla(0,0%,100%,.08)] text-xs rounded whitespace-nowrap ${toolWidth} ${newChanges}`}>
        {text}
      </div>
    </div>
  );
}
