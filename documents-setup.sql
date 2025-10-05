-- Create documents table
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    owner TEXT NOT NULL,
    "lastModifiedDate" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "lastModifiedBy" TEXT NOT NULL,
    "createdDate" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "createdBy" TEXT NOT NULL,
    validity DATE,
    "mimeType" TEXT NOT NULL,
    content TEXT NOT NULL,
    "isPreDefined" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for documents
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create policies for documents
CREATE POLICY "Allow read access to documents" ON public.documents
    FOR SELECT USING (true);

CREATE POLICY "Allow insert access to documents" ON public.documents
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update access to documents" ON public.documents
    FOR UPDATE USING (true);

CREATE POLICY "Allow delete access to documents" ON public.documents
    FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_name ON public.documents(name);
CREATE INDEX IF NOT EXISTS idx_documents_category ON public.documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_owner ON public.documents(owner);
CREATE INDEX IF NOT EXISTS idx_documents_is_predefined ON public.documents("isPreDefined");
CREATE INDEX IF NOT EXISTS idx_documents_created_date ON public.documents("createdDate");
CREATE INDEX IF NOT EXISTS idx_documents_validity ON public.documents(validity);

-- Create function to update updatedAt timestamp for documents
CREATE OR REPLACE FUNCTION update_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    NEW."lastModifiedDate" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updatedAt for documents
CREATE TRIGGER update_documents_updated_at 
    BEFORE UPDATE ON public.documents 
    FOR EACH ROW 
    EXECUTE FUNCTION update_documents_updated_at();

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Create storage policies for documents bucket
CREATE POLICY "Allow authenticated users to read documents" ON storage.objects
    FOR SELECT USING (bucket_id = 'documents' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to upload documents" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update documents" ON storage.objects
    FOR UPDATE USING (bucket_id = 'documents' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete documents" ON storage.objects
    FOR DELETE USING (bucket_id = 'documents' AND auth.role() = 'authenticated');
