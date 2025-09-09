import 'quill/dist/quill.snow.css';

const QuillContent = ({ htmlContent }) => {
  if (!htmlContent) return null;

  return (
    <div className="ql-snow">
      <div 
        className="ql-editor"
        dangerouslySetInnerHTML={{ __html: htmlContent }} 
      />
    </div>
  );
};

export default QuillContent;
