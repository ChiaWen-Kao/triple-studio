import type { Service, ServiceMode } from '../../types/services';
import { WebsiteVisual } from './visuals/WebsiteVisual';
import { WebAppVisual } from './visuals/WebAppVisual';
import { MobileVisual } from './visuals/MobileVisual';
import { WorkflowVisual } from './visuals/WorkflowVisual';
import { RedesignVisual } from './visuals/RedesignVisual';

const visuals = {
  website: WebsiteVisual,
  'web-app': WebAppVisual,
  mobile: MobileVisual,
  ai: WorkflowVisual,
  redesign: RedesignVisual,
};

export function ServiceCard({
  service,
  mode,
}: {
  service: Service;
  mode: ServiceMode;
}) {
  const copy = service[mode] ?? service.whole ?? service.part;
  if (!copy) return null;
  const Visual = visuals[service.id];
  const longTitle = copy.title.split(/\s+/).some((word) => word.length >= 11);
  return (
    <article className="services__step" hidden={!service[mode]}>
      <div className={`services__card services__card--${service.id}`}>
        <div className="services__copy">
          <p className="services__meta">{copy.meta}</p>
          <div>
            <h3 className={longTitle ? 'services__title--long' : undefined}>
              {copy.title}
            </h3>
            <p className="services__description">{copy.description}</p>
            <p className="services__examples">{copy.examples}</p>
          </div>
        </div>
        <Visual />
      </div>
    </article>
  );
}
