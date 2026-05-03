import { useState } from "react";

function Home() {
  const [active, setActive] = useState("home");

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-5">
        <h2 className="text-xl font-bold mb-6">Dukan Admin</h2>
        <ul className="space-y-4">
          <li className="cursor-pointer" onClick={() => setActive("home")}>Home</li>
          <li className="cursor-pointer" onClick={() => setActive("about")}>About</li>
          <li className="cursor-pointer" onClick={() => setActive("admin")}>Admin</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow p-4 font-semibold">
          Automobile Parts Store
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {active === "home" && <HomeContent />}
          {active === "about" && <About />}
          {active === "admin" && <Admin />}
        </div>

        {/* Footer */}
        <div className="bg-gray-800 text-white text-center p-3">
          © 2026 Dukan Automobile Parts
        </div>
      </div>
    </div>
  );
}

function HomeContent() {
  const products = [
    "Engine Oil",
    "Brake Pads",
    "Car Battery",
    "Headlights",
    "Tyres",
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Available Parts</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((item, index) => (
          <div key={index} className="bg-white p-4 shadow rounded-xl">
            <h2 className="font-semibold">{item}</h2>
            <p className="text-sm text-gray-500">High quality automobile part</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function About() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">About Us</h1>
      <p className="text-gray-700">
        Welcome to our Dukan where all types of automobile parts are available.
        We provide high-quality parts for cars and bikes at affordable prices.
      </p>
    </div>
  );
}

function Admin() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <form className="space-y-4 bg-white p-4 rounded-xl shadow">
        <input
          type="text"
          placeholder="Product Name"
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Price"
          className="w-full border p-2 rounded"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Product
        </button>
      </form>
    </div>
  );
}


export default Home;
