import { AutoFitText } from "./AutoFitText";

type FetchedValueLabelProps = {
  loading: boolean;
  value: string | number;
} & React.HTMLAttributes<HTMLDivElement>;

export const FetchedValueLabel = (props: FetchedValueLabelProps) => {
  const { loading, value, ...rest } = props;

  if (loading) {
    return (
      <div {...rest}>
        <div className="flex justify-end">
          <span className="text-base-content text-right loading loading-dots loading-xs"></span>
        </div>
      </div>
    );
  }

  return <AutoFitText {...rest} text={String(value)} />;
};
