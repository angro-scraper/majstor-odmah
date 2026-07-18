import { ModulePage } from "../../src/components/module-page";

export default async function ServiceModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module } = await params;
  return <ModulePage moduleKey={module} />;
}
