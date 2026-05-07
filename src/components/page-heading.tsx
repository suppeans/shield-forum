type PageHeadingProps = {
  label?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function PageHeading({
  label,
  title,
  description,
  action,
}: PageHeadingProps) {
  return (
    <div className="page-heading">
      <div>
        {label ? <p className="eyebrow">{label}</p> : null}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action ? <div className="heading-action">{action}</div> : null}
    </div>
  );
}
