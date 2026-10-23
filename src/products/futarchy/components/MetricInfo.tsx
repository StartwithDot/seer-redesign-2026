import { InfoTooltip } from './InfoTooltip';

interface MetricInfoProps {
  label: string;
  text: string;
}

export function MetricInfo({ label, text }: MetricInfoProps) {
  return <InfoTooltip variant="metric" label={`About ${label}`} text={text}>i</InfoTooltip>;
}
