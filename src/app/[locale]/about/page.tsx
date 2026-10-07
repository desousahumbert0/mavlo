import LegalPage, { legalMetadata } from "@/components/LegalPage";

type Props = { params: Promise<{ locale: string }> };

export const generateMetadata = ({ params }: Props) => legalMetadata("about", params);

export default function Page({ params }: Props) {
  return <LegalPage id="about" params={params} />;
}
