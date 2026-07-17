import TeamCard from "@/components/TeamCard";
import { teamMembers } from "@/data/teamData";

export const metadata = {
  title: "About Our Team - SFSU Tutoring Marketplace",
  description:
    "Meet our talented team of computer science students at San Francisco State University working on innovative software solutions.",
};

export default function AboutTeam() {
  return (
    <div className="min-h-screen">
      <section className="bg-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="section-heading text-neutral-dark mb-4">Our Team</h1>
            <p className="body-text text-neutral-medium max-w-2xl mx-auto">
              Get to know the talented individuals behind this project. Each
              team member brings unique skills, perspectives, and passion to our
              collaborative effort.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* Project Info Section */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="section-heading text-neutral-dark mb-6">
            About This Project
          </h2>
          <p className="body-text text-neutral-medium mb-8">
            This project is part of our coursework at San Francisco State
            University. We&apos;re applying the knowledge we&apos;ve gained in
            class to build a real-world application, focusing on modern web
            development practices, team collaboration, and user experience
            design.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mt-12">
            <div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">1</div>
                <div className="caption text-neutral-medium">Team No</div>
              </div>
              <div className="text-3xl font-bold text-primary mb-2">
                {teamMembers.length}
              </div>
              <div className="caption text-neutral-medium">Team Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">1</div>
              <div className="caption text-neutral-medium">Semester</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                CSC 648
              </div>
              <div className="caption text-neutral-medium">Course</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">SFSU</div>
              <div className="caption text-neutral-medium">University</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
