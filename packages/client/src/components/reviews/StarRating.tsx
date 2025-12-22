import { FaRegStar, FaStar } from 'react-icons/fa';

type Props = {
  value: number;
};

const StarRating = ({ value }: Props) => {
  const placeholder = [1, 2, 3, 4, 5];
  return (
    <div className="flex gap-1 text-yellow-400 border-yellow-700">
      {placeholder.map((p) => {
        return p <= value ? <FaStar key={p} /> : <FaRegStar key={p} />;
      })}
    </div>
  );
};

export default StarRating;
