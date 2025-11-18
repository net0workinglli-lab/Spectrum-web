import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | SUNNY AUTO - Industrial & Logistics Solutions',
  description: 'Established under the esteemed umbrella of Leong Lee International Limited, SUNNY AUTO emerges as a pioneering solution provider in transportation and equipment, specializing in serving the industrial and logistics sectors.',
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

