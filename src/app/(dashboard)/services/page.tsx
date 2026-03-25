import { getServices } from "@/lib/actions/services";
import ServicesClient from "./services-client";

export default async function ServicesPage() {
  const services = await getServices();

  return <ServicesClient initialServices={services} />;
}
