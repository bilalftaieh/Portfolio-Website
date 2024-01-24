import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image } from "@nextui-org/react";

interface ProjectCardProps {
  name: string;
  description: string;
  sourceRepoLink: string;
  sourceLink: string
  logo: string;

}

export default function ProjectCard({ name, description, sourceLink, logo, sourceRepoLink }: ProjectCardProps) {
  return (
    <Card className="max-w-[400px] bg-transparent text-custom-two">
      <CardHeader className="flex gap-3">
        <Image
          alt="nextui logo"
          height={40}
          radius="sm"
          src={logo}
          width={40}
        />
        <div className="flex flex-col">
          <p className="text-md text-white font-bold">{name}</p>
          <p className="text-small text-gray-300">{sourceLink}</p>
        </div>
      </CardHeader>
      <Divider className="bg-white" />
      <CardBody>
        <p className="text-gray-400">{description}</p>
      </CardBody>
    </Card>
  )
}