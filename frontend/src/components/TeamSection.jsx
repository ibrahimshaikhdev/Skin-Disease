import ibrahim from "../assets/team/ibrahim.png";
import sahil from "../assets/team/sahil.png";
import tohid from "../assets/team/tohid.png";

// To use your own photos, replace the three image files in
// src/assets/team/ (ibrahim.png, sahil.png, tohid.png) — keep the same names.
const team = [
  { name: "Ibrahim Shaikh", role: "Backend Developer (Java)", photo: ibrahim },
  { name: "Sahil Sahare", role: "Machine Learning Engineer", photo: sahil },
  { name: "Tohid Pathan", role: "Frontend & UI Engineer", photo: tohid },
];

export default function TeamSection() {
  return (
    <section className="bg-gradient-to-br from-navy via-navy-light to-navy-dark py-16 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Meet the Team
        </h2>
        <p className="text-cyan-pale/80 mb-10">
          DermacareVision AI was designed and built by
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {team.map((m) => (
            <div key={m.name} className="flex flex-col items-center">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-cyan/40 shadow-lg shadow-cyan/20 mb-4">
                <img
                  src={m.photo}
                  alt={m.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-white font-semibold text-lg">{m.name}</h3>
              <p className="text-cyan-light text-sm">{m.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
