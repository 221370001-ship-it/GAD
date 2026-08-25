import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, MapPin, Phone, Clock } from 'lucide-react';
import footerLogo from '../../assets/footer-logo.png';
import { CLINIC } from '../../utils/helpers';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-deep text-primary-bg/85">
      {/* CTA band */}
      <div className="border-b border-white/10">
        <div className="container-lux flex flex-col items-center gap-6 py-14 text-center">
          <h2 className="font-heading text-3xl font-semibold text-white sm:text-4xl">
            Begin Your Skin Transformation Today
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-primary-bg/70">
            Schedule a consultation with our certified professionals and discover how GAD Aesthetic
            Clinic can help you achieve your aesthetic goals.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/#booking" className="btn-gold">
              Book Consultation
            </Link>
            <a
              href={`https://wa.me/${CLINIC.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-7 py-3 text-sm font-bold uppercase tracking-widest text-white transition-all duration-300 hover:border-accent-gold hover:text-accent-gold"
            >
              <Phone size={15} />
              Call Now
            </a>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-lux grid grid-cols-1 gap-12 py-14 lg:grid-cols-2">
        <div>
          <div className="inline-block rounded-2xl bg-primary-bg px-5 py-4 shadow-soft">
            <img src={footerLogo} alt="GAD Aesthetic Clinic — By Dr. Abdullah Asif" className="h-auto w-64 object-contain sm:w-72" />
          </div>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-primary-bg/65">
            Premium aesthetic care in the heart of Gujranwala — bespoke skin, hair and laser
            solutions delivered with clinical excellence by Dr. Abdullah Asif.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-7 sm:gap-y-3">
            <a
              href={CLINIC.instagram}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2.5 text-sm font-semibold text-primary-bg/75 transition-colors duration-300 hover:text-accent-gold"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 transition-all duration-300 group-hover:border-accent-gold group-hover:text-accent-gold">
                <Instagram size={15} />
              </span>
              {CLINIC.instagramHandle}
            </a>
            <a
              href={CLINIC.facebook}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2.5 text-sm font-semibold text-primary-bg/75 transition-colors duration-300 hover:text-accent-gold"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 transition-all duration-300 group-hover:border-accent-gold group-hover:text-accent-gold">
                <Facebook size={15} />
              </span>
              {CLINIC.facebookHandle}
            </a>
            <a
              href={`tel:${CLINIC.phoneRaw}`}
              className="group inline-flex items-center gap-2.5 text-sm font-semibold text-primary-bg/75 transition-colors duration-300 hover:text-accent-gold"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 transition-all duration-300 group-hover:border-accent-gold group-hover:text-accent-gold">
                <Phone size={15} />
              </span>
              {CLINIC.phoneRaw}
            </a>
          </div>
        </div>

        <div className="lg:justify-self-end lg:w-full lg:max-w-md">
          <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-accent-gold">Contact</h4>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-accent-gold" />
              <span className="leading-relaxed text-primary-bg/70">{CLINIC.address}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={16} className="shrink-0 text-accent-gold" />
              <a href={`tel:${CLINIC.phoneRaw}`} className="transition-colors hover:text-accent-gold">
                {CLINIC.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="shrink-0 text-accent-gold" />
              <a href={`mailto:${CLINIC.email}`} className="transition-colors hover:text-accent-gold">
                {CLINIC.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Clock size={16} className="mt-0.5 shrink-0 text-accent-gold" />
              <span className="leading-relaxed text-primary-bg/70">
                <span className="font-semibold text-primary-bg/90">Monday to Sunday:</span> 12 PM – 9 PM
                <br />
                <span className="text-xs text-primary-bg/50">Open 7 days a week</span>
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-lux flex flex-col items-center justify-between gap-3 py-6 text-xs text-primary-bg/50 sm:flex-row">
          <p>© {year} GAD Aesthetic Clinic — By Dr. Abdullah Asif. All rights reserved.</p>
          <p>{CLINIC.website} · Gujranwala, Pakistan</p>
        </div>
      </div>
    </footer>
  );
}
