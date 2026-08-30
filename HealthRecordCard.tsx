import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Pill, TestTube, Download, Share } from "lucide-react";
import type { HealthRecord } from "@shared/schema";

interface HealthRecordCardProps {
  record: HealthRecord;
  onDownload?: (record: HealthRecord) => void;
  onShare?: (record: HealthRecord) => void;
}

export function HealthRecordCard({ record, onDownload, onShare }: HealthRecordCardProps) {
  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'prescription':
        return <Pill className="text-lg" />;
      case 'lab':
      case 'lab results':
        return <TestTube className="text-lg" />;
      default:
        return <FileText className="text-lg" />;
    }
  };

  const getIconColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'prescription':
        return 'bg-purple-600';
      case 'lab':
      case 'lab results':
        return 'bg-blue-600';
      default:
        return 'bg-green-600';
    }
  };

  const getTagColor = (tag: string) => {
    const colors: Record<string, string> = {
      'Lab Results': 'bg-green-100 text-green-800',
      'Vitals': 'bg-blue-100 text-blue-800',
      'Preventive Care': 'bg-purple-100 text-purple-800',
      'Prescription': 'bg-orange-100 text-orange-800',
      'Blood Pressure': 'bg-red-100 text-red-800',
      'Preventive': 'bg-blue-100 text-blue-800',
    };
    return colors[tag] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 border-l-4 border-l-green-600">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-start space-x-3">
          <div className={`${getIconColor(record.type)} text-white p-2 rounded-lg`}>
            {getIcon(record.type)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{record.title}</h3>
            {record.providerId && (
              <p className="text-sm text-gray-600">Provider ID: {record.providerId}</p>
            )}
            <p className="text-sm text-gray-500">
              {new Date(record.recordDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          {onDownload && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onDownload(record)}
              className="text-gray-400 hover:text-gray-600"
            >
              <Download className="w-4 h-4" />
            </Button>
          )}
          {onShare && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onShare(record)}
              className="text-gray-400 hover:text-gray-600"
            >
              <Share className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      
      {record.summary && (
        <div className="text-sm text-gray-600 mb-3">
          <p><strong>Summary:</strong> {record.summary}</p>
        </div>
      )}
      
      {record.description && (
        <div className="text-sm text-gray-600 mb-3">
          <p><strong>Details:</strong> {record.description}</p>
        </div>
      )}
      
      {record.tags && record.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {record.tags.map((tag, index) => (
            <Badge 
              key={index}
              className={`text-xs rounded-full ${getTagColor(tag)}`}
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
