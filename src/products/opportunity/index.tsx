import '@fontsource-variable/inter-tight';
import { OpportunityApp } from './components/OpportunityApp';
import { RouteBoundary } from './components/RouteStates';

export function Page() {
  return <RouteBoundary><OpportunityApp /></RouteBoundary>;
}
