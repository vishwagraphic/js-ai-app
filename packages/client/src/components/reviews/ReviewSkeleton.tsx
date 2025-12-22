import Skeleton from 'react-loading-skeleton';

type Props = {
  key: number;
};

const ReviewSkeleton = ({ key }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <div key={key} className="mb-4">
        <Skeleton width={150} />
        <Skeleton width={100} />
        <Skeleton count={2} />
      </div>
    </div>
  );
};

export default ReviewSkeleton;
