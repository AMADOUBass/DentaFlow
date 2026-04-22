import { Shield, Lock, Eye } from 'lucide-react'

export default function PrivacyPolicyPageEn() {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Privacy Policy</h1>
        <p className="text-slate-500 font-medium italic">Last updated: April 22, 2026</p>
      </div>

      <div className="prose prose-slate max-w-none space-y-8">
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Shield className="h-6 w-6" />
            <h2 className="text-2xl font-black m-0">Law 25 Compliance</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            In accordance with the Act respecting the protection of personal information in the private sector (Law 25), 
            <strong> DentaFlow Systems Inc.</strong> is committed to protecting the integrity and confidentiality of 
            dental and personal data processed on its platform.
          </p>
        </section>

        <section className="space-y-4 p-8 bg-slate-50 rounded-[2rem]">
          <h3 className="text-xl font-bold text-slate-900">1. Data Collection</h3>
          <p className="text-slate-600">
            We collect only the information strictly necessary for the provision of dental care:
          </p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2">
            <li>Identity (Name, Surname, Date of Birth)</li>
            <li>Contact Info (Email, Phone, Address)</li>
            <li>RAMQ Number (End-to-end encrypted)</li>
            <li>Medical Notes and Odontograms</li>
          </ul>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-emerald-600">
            <Lock className="h-6 w-6" />
            <h3 className="text-xl font-bold m-0">2. Security and Encryption</h3>
          </div>
          <p className="text-slate-600 leading-relaxed">
            All sensitive data is encrypted using the <strong>AES-256-GCM</strong> algorithm. 
            Data servers are physically located in <strong>Canada (Quebec/Ontario Region)</strong> 
            to ensure the data sovereignty of Quebec citizens' health information.
          </p>
        </section>
      </div>
    </div>
  )
}
