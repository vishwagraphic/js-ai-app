
const TypingIndicator = () => {
  return (
    <div className="flex gap-1 p-4 my-2 rounded-xl bg-gray-200 ">
      <Dots />
      <Dots claassName='[animation-delay:0.2s]' />
      <Dots claassName='[animation-delay:0.4s]'/>
    </div>
  );
}

type DotProps = { 
    claassName?: string;
};

const Dots = ({claassName}: DotProps) => {
    return (<div className={`w-2 h-2 rounded-full bg-gray-800 animate-pulse${claassName ? ` ${claassName}` : ''}`} ></div>);
}

export default TypingIndicator;
