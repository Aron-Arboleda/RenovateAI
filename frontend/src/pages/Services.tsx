import {Link, useLocation} from "react-router-dom";
import {useEffect} from "react";

export default function Services() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({behavior: "smooth"});
      }
    }
  }, [location]);

  const services = [
    {
      id: "kitchen",
      title: "Kitchen Renovation",
      description:
        "Transform the heart of your home with a complete kitchen renovation. We handle layout redesign, custom cabinetry, countertop installation, appliance upgrades, and modern lighting solutions.",
      scope: [
        "Layout planning and space optimization",
        "Custom cabinetry design and installation",
        "Countertop selection and installation",
        "Appliance specification and integration",
        "Plumbing and electrical updates",
        "Backsplash tile work",
        "Flooring replacement",
        "Lighting design and fixture installation",
      ],
    },
    {
      id: "bathroom",
      title: "Bathroom Remodel",
      description:
        "Create a spa-like retreat with a comprehensive bathroom renovation. From fixture upgrades to complete layout changes, we deliver functional and beautiful bathroom spaces.",
      scope: [
        "Fixture replacement and upgrades",
        "Shower and tub installation",
        "Tile work for floors, walls, and surrounds",
        "Vanity design and installation",
        "Lighting and ventilation improvements",
        "Plumbing system updates",
        "Waterproofing and moisture control",
        "Accessibility modifications",
      ],
    },
    {
      id: "whole-home",
      title: "Whole-Home Renovation",
      description:
        "Reimagine your entire living space with a comprehensive whole-home renovation. We coordinate multi-room projects that transform your house into your dream home.",
      scope: [
        "Architectural planning and design",
        "Structural modifications and repairs",
        "Complete interior finishes",
        "Kitchen and bathroom renovations",
        "Flooring throughout",
        "Electrical and plumbing system upgrades",
        "HVAC improvements",
        "Interior and exterior painting",
        "Window and door replacement",
      ],
    },
    {
      id: "basement",
      title: "Basement Finishing",
      description:
        "Convert unfinished basement space into functional living areas. Whether you need a home office, entertainment room, or guest suite, we maximize your below-grade square footage.",
      scope: [
        "Framing and drywall installation",
        "Egress window planning and installation",
        "Moisture mitigation and waterproofing",
        "Electrical wiring and lighting",
        "Plumbing for bathrooms or wet bars",
        "Flooring suitable for below-grade conditions",
        "HVAC extensions",
        "Built-in storage solutions",
      ],
    },
    {
      id: "addition",
      title: "Home Additions",
      description:
        "Expand your living space with a custom home addition. We handle foundation work, structural integration, and complete finishing to seamlessly extend your home.",
      scope: [
        "Foundation and structural engineering",
        "Framing and roofing",
        "Exterior siding and trim",
        "Window and door installation",
        "Electrical and plumbing extensions",
        "Insulation and vapor barriers",
        "Interior finishes and trim work",
        "Integration with existing home systems",
      ],
    },
  ];

  return (
    <div className="bg-stone-950">
      <section className="border-b border-white/10 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-sora text-4xl font-bold text-white sm:text-5xl">
            Renovation Services
          </h1>
          <p className="mt-6 text-lg text-stone-300">
            Comprehensive renovation solutions for every part of your home. Our
            AI-assisted intake system captures project details and routes
            qualified leads through our workflow.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-16">
          {services.map((service, index) => (
            <div
              key={service.id}
              id={service.id}
              className="scroll-mt-20 rounded-2xl border border-white/10 bg-white/5 p-8 sm:p-10"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-300 font-sora text-lg font-bold text-stone-950">
                    {index + 1}
                  </div>
                  <h2 className="mt-6 font-sora text-3xl font-bold text-white">
                    {service.title}
                  </h2>
                  <p className="mt-4 max-w-3xl text-lg text-stone-300">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-semibold text-white">Typical Scope:</h3>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {service.scope.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <svg
                        className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-stone-400">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/contact"
                  className="rounded-xl bg-amber-300 px-6 py-2.5 font-semibold text-stone-950 transition hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
                >
                  Start This Project
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    const chatButton = document.querySelector(
                      '[aria-label="Open chat"]',
                    ) as HTMLButtonElement;
                    if (chatButton) chatButton.click();
                  }}
                  className="rounded-xl border border-white/20 bg-white/5 px-6 py-2.5 font-semibold text-stone-100 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
                >
                  Ask Questions
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 bg-stone-900 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-amber-300/30 bg-gradient-to-br from-amber-300/10 to-transparent p-8 text-center sm:p-12">
          <h2 className="font-sora text-3xl font-bold text-white sm:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mt-4 text-lg text-stone-300">
            Share your renovation goals and let our AI-assisted qualification
            workflow route your project.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-block rounded-xl bg-amber-300 px-8 py-3.5 font-semibold text-stone-950 transition hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
          >
            Submit Project Details
          </Link>
        </div>
      </section>
    </div>
  );
}
