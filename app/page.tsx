'use client'

import AuthTopbar from "./components/AuthTopbar";
import Navbar from "./components/Navbar";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  return (
    <div className="min-h-screen">
      <main>
        <AuthTopbar />
        <div className="py-20 w-full px-5">
          <h1 className="text-5xl font-serif italic text-center py-5">Welcome to MiniHelp</h1>
          <div className="p-3 w-full">

            <h2 className="text-xl underline">Our Mission</h2>
            <p className="text-lg italic px-15 py-10 text-justify">

              "To bridge the gap between talented students seeking internship opportunities
              and companies looking for passionate, skilled interns.
              We aim to make the internship matching process faster, easier, and more transparent
              — helping both applicants and organizations grow together."

            </p>

          </div>

          <div className="w-full space-x-10 flex flex-row">

            <div className="p-3 w-full bg-blue-100 shadow-md rounded-2xl">

              <h2 className="text-xl underline">What you get</h2>
              <ul className="py-5 space-y-6">

                <li>🔍 Find Internships Easily  </li>
                <li>💼 Post Internship Opportunities  </li>
                <li>🤝 Connect and Communicate  </li>
                <li>⭐ Verified Profiles  </li>


              </ul>

            </div>

            <div className="p-3 bg-blue-100 shadow-md rounded-2xl">

              <div className="flex flex-row justify-between">
                <h2 className="text-xl underline">As a company</h2>
                <button onClick={() => router.push('/company')} className=" text-white bg-black rounded-lg px-2 pb-0.5 text-sm font-bold hover:cursor-pointer">Get Started</button>
              </div>
              <p className="py-5 text-justify px-4">

                MiniHelp simplifies the process for companies to find talented interns
                by providing an easy-to-use dashboard for posting opportunities,
                managing applications, and reviewing detailed student profiles.
                Businesses can communicate directly with potential interns,
                ensuring a smoother recruitment process. With verified applicants
                and organized insights, companies can focus on building strong teams
                while contributing to the growth of future professionals.

              </p>

            </div>
            <div className="p-3 bg-blue-100 shadow-md rounded-2xl">

              <div className="flex flex-row justify-between">
                <h2 className="text-xl underline">As an applicant</h2>
                <button onClick={() => router.push('/student')} className=" text-white bg-black rounded-lg px-2 pb-0.5 text-sm font-bold hover:cursor-pointer">Get Started</button>
              </div>
              <p className="py-5 text-justify px-4">

                MiniHelp empowers students to easily discover and apply for
                verified internship opportunities across various industries.
                Applicants can build a professional profile that highlights their
                skills, education, and goals — allowing companies to notice them
                without needing to send resumes repeatedly. With real-time communication
                tools, students can directly connect with employers, track their application
                progress, and gain confidence knowing that all listings are verified and trustworthy.


              </p>

            </div>

          </div>

        </div>
        <Navbar />
      </main>
    </div>
  );
}
