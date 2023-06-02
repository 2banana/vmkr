interface ProgressProps {
  ratio: number;
}

const ProgressComponent = ({ ratio }: ProgressProps) => {
  const percentage = Math.round(ratio * 100);

  return (
    <div>
      <span>{percentage}%</span>
    </div>
  );
};

export { ProgressComponent };
