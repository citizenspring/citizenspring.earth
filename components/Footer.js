const Footer = ({ googleDocId }) => (
  <div className="footer mt-8 border-t border-gray-300 flex flex-row justify-between items-center w-screen max-w-screen-md mx-auto p-3">
    <div>
      <a
        href="https://citizenspring.earth"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="/citizenspring.svg"
          alt="Citizen Spring Logo"
          className="h-10 mx-0"
        />
      </a>
    </div>
    <div>
      <a
        href={`https://docs.google.com/document/d/${googleDocId}/edit`}
        target="_blank"
        className="text-gray-600"
      >
        Edit Page 📝
      </a>
    </div>
  </div>
);

export default Footer;
