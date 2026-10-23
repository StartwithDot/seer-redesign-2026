import React from 'react';

/** A small inline drawing stays visible while WebGL loads or is unavailable. */
export const SculptureFallback: React.FC = () => (
  <svg className="v5-sculpture-fallback" viewBox="0 0 720 650" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="seer-ceramic" x1="135" y1="0" x2="640" y2="0" gradientUnits="userSpaceOnUse">
        <stop stopColor="#777174" /><stop offset="0.15" stopColor="#625c65" />
        <stop offset="0.42" stopColor="#a09aa6" /><stop offset="0.74" stopColor="#eeecef" />
        <stop offset="1" stopColor="#fffefd" />
      </linearGradient>
      <linearGradient id="seer-inner" x1="0" y1="0" x2="0" y2="1">
        <stop stopColor="#7b688e" /><stop offset="0.38" stopColor="#d8bdf8" />
        <stop offset="1" stopColor="#f8f4fd" />
      </linearGradient>
      <linearGradient id="seer-ramp" x1="250" y1="260" x2="530" y2="450" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fffefd" /><stop offset="0.62" stopColor="#fdfaff" />
        <stop offset="1" stopColor="#bea0ec" />
      </linearGradient>
      <linearGradient id="seer-ramp-edge" x1="310" y1="390" x2="530" y2="445" gradientUnits="userSpaceOnUse">
        <stop stopColor="#bdb0d2" /><stop offset="1" stopColor="#ece4f6" />
      </linearGradient>
      <linearGradient id="seer-glass" x1="314" y1="319" x2="523" y2="360" gradientUnits="userSpaceOnUse">
        <stop stopColor="#e4d6ff" stopOpacity="0.38" /><stop offset="0.24" stopColor="#b79bff" stopOpacity="0.78" />
        <stop offset="0.64" stopColor="#7a3cff" stopOpacity="0.83" /><stop offset="1" stopColor="#7a3cff" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="seer-glass-sheen" x1="314" y1="320" x2="523" y2="410" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fff" stopOpacity="0.28" /><stop offset="0.26" stopColor="#fff" stopOpacity="0.03" />
        <stop offset="0.78" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#fff" stopOpacity="0.08" />
      </linearGradient>
      <linearGradient id="seer-rim-ao" x1="0" y1="0" x2="0" y2="1">
        <stop stopColor="#69616f" stopOpacity="0" /><stop offset="0.45" stopColor="#69616f" stopOpacity="0.05" />
        <stop offset="1" stopColor="#69616f" stopOpacity="0.78" />
      </linearGradient>
      <filter id="seer-soft-rim" x="-5%" y="-30%" width="110%" height="160%">
        <feGaussianBlur stdDeviation="3" />
      </filter>
      <radialGradient id="seer-contact"><stop stopColor="#4f465c" stopOpacity="0.78" /><stop offset="1" stopColor="#4f465c" stopOpacity="0" /></radialGradient>
      <radialGradient id="seer-reflection"><stop stopColor="#7a3cff" stopOpacity="0.78" /><stop offset="1" stopColor="#7a3cff" stopOpacity="0" /></radialGradient>
    </defs>
    <ellipse cx="371" cy="552" rx="329" ry="54" fill="url(#seer-contact)" />
    <ellipse cx="418" cy="572" rx="320" ry="108" fill="url(#seer-reflection)" />
    <path d="M102 355C130 310 234 286 364 286C477 286 575 303 618 332V483C575 458 471 442 364 442C240 442 140 467 102 500V355Z" fill="url(#seer-ceramic)" />
    <path d="M178 190C178 129 283 82 414 82C545 82 650 129 650 190V307C650 249 545 204 414 204C283 204 178 249 178 307V190Z" fill="url(#seer-ceramic)" />
    <path d="M178 284C178 226 283 181 414 181C545 181 650 226 650 284V307C650 249 545 204 414 204C283 204 178 249 178 307V284Z" fill="url(#seer-rim-ao)" filter="url(#seer-soft-rim)" />
    <path fillRule="evenodd" d="M650 307C650 365 545 407 414 407C283 407 178 365 178 307C178 249 283 204 414 204C545 204 650 249 650 307ZM598 307C598 270 515 242 414 242C313 242 230 270 230 307C230 344 313 372 414 372C515 372 598 344 598 307Z" fill="url(#seer-inner)" />
    <ellipse cx="414" cy="307" rx="184" ry="65" stroke="#74697e" strokeOpacity="0.18" strokeWidth="8" filter="url(#seer-soft-rim)" />
    <path d="M258 280C281 258 355 244 414 244C468 244 510 250 526 258C477 253 380 274 300 297C245 314 259 365 327 389C374 406 477 422 532 437L527 463C474 443 360 430 314 413C223 380 212 316 258 280Z" fill="url(#seer-ramp)" />
    <path d="M327 389C374 406 477 422 532 437L531 446C476 431 373 415 324 397C278 380 253 356 252 335C259 358 285 375 327 389Z" fill="url(#seer-ramp-edge)" />
    <path d="M314 319C348 286 437 279 523 261V403C458 414 356 414 314 456V319Z" fill="url(#seer-glass)" stroke="#8f65dd" strokeOpacity="0.18" strokeWidth="1.5" />
    <path d="M314 319C348 286 437 279 523 261V403C458 414 356 414 314 456V319Z" fill="url(#seer-glass-sheen)" />
    <path d="M523 261L527 264V405L523 403Z" fill="#6833d4" fillOpacity="0.85" />
    <path d="M315 320C349 287 437 280 522 262M522 263V402" stroke="#fff" strokeOpacity="0.72" strokeWidth="1.5" />
    <path d="M618 332C591 339 550 350 526 368V480C555 457 597 447 618 443V332Z" fill="url(#seer-ceramic)" />
    <path d="M184 485C184 463 285 444 410 444C535 444 636 463 636 485V536C636 558 535 572 410 572C285 572 184 558 184 536V485Z" fill="url(#seer-ceramic)" />
    <path d="M184 489C220 474 315 471 410 471C505 471 600 474 636 489" stroke="#79737f" strokeOpacity="0.18" strokeWidth="10" filter="url(#seer-soft-rim)" />
    <path d="M184 485C184 463 285 444 410 444C535 444 636 463 636 485C600 470 505 467 410 467C315 467 220 470 184 485Z" fill="#faf8fc" />
    <path d="M184 485C220 470 315 467 410 467C505 467 600 470 636 485" stroke="#b5aebb" strokeOpacity="0.25" strokeWidth="1.5" />
  </svg>
);
