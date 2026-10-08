import { Rocket, Shield, ArrowRight } from 'lucide-react';

type Props = {
  onGetStarted: () => void;
};

export default function Hero({ onGetStarted }: Props) {
  return (
    <section className="relative overflow-hidden">
      {/* Ambient glow background */}
      <div className="absolute inset-0 gradient-radial-blue pointer-events-none" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(59, 130, 246, 0.06) 0%, transparent 70%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-16 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs font-medium text-brand mb-8 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse-glow" />
          Software Artifact Platform
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
          Deploy. Monitor.
          <br />
          <span className="text-brand">Command.</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-lg text-gray-400 leading-relaxed mb-10 animate-slide-up" style={{ animationDelay: '200ms' }}>
          Veridian is your unified dashboard for managing and monitoring every application
          across your infrastructure — from GitHub Pages to Cloudflare to your own servers.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <button
            onClick={onGetStarted}
            className="group flex items-center gap-2 px-7 py-3.5 rounded-xl btn-primary font-semibold hover:opacity-90 transition-all glow-blue-strong"
          >
            View Dashboard
            <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
          <a
            href="#features"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl glass-card text-gray-300 hover:text-white transition-colors font-medium"
          >
            Learn More
          </a>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-16 animate-fade-in" style={{ animationDelay: '500ms' }}>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Rocket size={16} className="text-brand" />
            One-click deploys
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Shield size={16} className="text-brand" />
            Live health monitoring
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <ArrowRight size={16} className="text-brand" />
            Any hosting platform
          </div>
        </div>
      </div>

      {/* Features section */}
      <div id="features" className="relative max-w-7xl mx-auto px-6 lg:px-8 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Rocket,
              title: 'Dynamic Application Registry',
              desc: 'Add, edit, and remove application tiles on the fly. No restarts, no config files — just click and go.',
            },
            {
              icon: Shield,
              title: 'Real-time Health Checks',
              desc: 'Every tile reports live status, response time, and availability. Know instantly when something goes down.',
            },
            {
              icon: ArrowRight,
              title: 'Platform Agnostic',
              desc: 'GitHub Pages, Cloudflare, Vercel, or your own servers — if it has a URL, Veridian can track it.',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="glass-card rounded-2xl p-6 animate-slide-up"
              style={{ animationDelay: `${400 + i * 100}ms` }}
            >
              <div className="w-11 h-11 rounded-xl bg-brand/10 text-brand flex items-center justify-center mb-4 glow-blue">
                <feature.icon size={22} />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
