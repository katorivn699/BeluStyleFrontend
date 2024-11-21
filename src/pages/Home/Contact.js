import React from "react";

function Contact() {
  const teamMembers = [
    {
      name: "Nguyen Tan Minh",
      role: "CEO & Founder",
      email: "minhntce180111@fpt.edu.vn",
    },
    {
      name: "Belu Nguyen",
      role: "Customer Support Manager",
      email: "belucom2k4@outlook.com",
    },
  ];

  return (
    <div className="font-poppins">
      <div className="px-6 py-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-semibold mb-4">Contact Us</h1>
        <p className="text-lg mb-6">
          We’d love to hear from you! If you have any questions or need support,
          feel free to get in touch with our team.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="p-6 border border-gray-300 rounded-lg shadow-md"
            >
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-md">{member.role}</p>
              <p className="text-md">Email: {member.email}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Get in Touch</h2>
        <p className="text-lg mb-6">
          If you have any inquiries or need further information, please feel
          free to contact us via email.
        </p>

        {/* Button to open default mail client */}
        <div className="flex justify-center mt-6">
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=dna53611@gmail.com&su=Inquiry&body=Hello, I would like to inquire about..."
            className="px-6 py-3 bg-blue-600 text-white text-lg rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200"
          >
            Email Us
          </a>
        </div>
      </div>
    </div>
  );
}

export default Contact;
