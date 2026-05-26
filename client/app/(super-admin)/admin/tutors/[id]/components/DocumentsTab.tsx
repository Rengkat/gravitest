import { FileText, Shield, Award, Upload } from "lucide-react";
import { DocumentCard } from "./Primitives";

interface Props {
  cvUrl?: string;
  idCardUrl?: string;
  certificateUrls: string[];
}

export function DocumentsTab({ cvUrl, idCardUrl, certificateUrls }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <DocumentCard label="CV / Resume" url={cvUrl}     icon={FileText} />
      <DocumentCard label="ID Card"     url={idCardUrl} icon={Shield}   />
      {certificateUrls.map((url, idx) => (
        <DocumentCard key={idx} label={`Certificate ${idx + 1}`} url={url} icon={Award} />
      ))}

      {/* Upload slot */}
      <div className="p-8 rounded-2xl bg-white border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-green-800/30 transition-colors">
        <Upload size={32} className="text-gray-300 mb-2" />
        <span className="text-[13px] text-text-muted">Upload Document</span>
      </div>
    </div>
  );
}
