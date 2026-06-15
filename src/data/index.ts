export const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Markets', href: '#dashboard' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Security', href: '#security' },
]

export const stats = [
  { label: 'Active Traders', value: 10_400_000, suffix: '+', prefix: '' },
  { label: 'Volume Traded', value: 48, suffix: 'B+', prefix: '$' },
  { label: 'Markets Covered', value: 140, suffix: '+', prefix: '' },
  { label: 'Execution Uptime', value: 99.97, suffix: '%', prefix: '' },
]

export const partners = [
  { name: 'Goldman Sachs', logo: 'https://cdn.simpleicons.org/goldmansachs/111111', logoDark: 'https://cdn.simpleicons.org/goldmansachs/ffffff' },
  { name: 'Coinbase',      logo: 'https://cdn.simpleicons.org/coinbase/111111',      logoDark: 'https://cdn.simpleicons.org/coinbase/ffffff' },
  { name: 'Binance',       logo: 'https://cdn.simpleicons.org/binance/111111',       logoDark: 'https://cdn.simpleicons.org/binance/ffffff' },
  { name: 'Stripe',        logo: 'https://cdn.simpleicons.org/stripe/111111',        logoDark: 'https://cdn.simpleicons.org/stripe/ffffff' },
  { name: 'PayPal',        logo: 'https://cdn.simpleicons.org/paypal/111111',        logoDark: 'https://cdn.simpleicons.org/paypal/ffffff' },
  { name: 'Visa',          logo: 'https://cdn.simpleicons.org/visa/111111',          logoDark: 'https://cdn.simpleicons.org/visa/ffffff' },
  { name: 'Mastercard',    logo: 'https://cdn.simpleicons.org/mastercard/111111',    logoDark: 'https://cdn.simpleicons.org/mastercard/ffffff' },
  { name: 'Robinhood',     logo: 'https://cdn.simpleicons.org/robinhood/111111',     logoDark: 'https://cdn.simpleicons.org/robinhood/ffffff' },
]

export const features = [
  {
    icon: 'brain',
    title: 'Signals That See First',
    description: 'A live AI engine reads millions of data points a second and surfaces high-conviction setups before the move — you act on the signal, not the news.',
    tag: 'AI Engine',
  },
  {
    icon: 'zap',
    title: 'Execution at the Speed of Light',
    description: 'Smart order routing fills in under 50 milliseconds across every venue. In markets, speed is alpha — and we hand you the fastest path to the trade.',
    tag: 'Sub-50ms',
  },
  {
    icon: 'pieChart',
    title: 'Your Book on Autopilot',
    description: 'Allocation, hedging, and rebalancing run 24/7. Set the rules once and the desk keeps your portfolio optimized while you live your life.',
    tag: 'Automated',
  },
  {
    icon: 'shield',
    title: 'Capital Defended by Default',
    description: 'Automated stops, live VaR, and one-tap hedging stand guard the instant volatility spikes — your downside is covered before you even notice.',
    tag: 'Risk Control',
  },
  {
    icon: 'activity',
    title: 'The Whole Tape, One Screen',
    description: 'Pro-grade charts and sub-millisecond feeds in a single cockpit. Watch the order flow move and respond on the very same tick.',
    tag: 'Live Data',
  },
  {
    icon: 'globe',
    title: 'Every Market, One Account',
    description: 'Equities, options, crypto, forex, and commodities — traded from one account, with razor-thin fees and institutional-depth liquidity.',
    tag: 'All Assets',
  },
]

export const howItWorksSteps = [
  {
    step: '01',
    title: 'Create Your Account',
    description: 'Sign up and verify in under two minutes. No paperwork, no waiting — you\'re trade-ready before the next candle closes.',
    icon: 'userPlus',
  },
  {
    step: '02',
    title: 'Fund in Seconds',
    description: 'Top up by bank, wire, or crypto. Balances clear fast and become live buying power the moment they land.',
    icon: 'creditCard',
  },
  {
    step: '03',
    title: 'Let the Edge Compound',
    description: 'Deploy AI setups or your own rules, automate the execution, and watch every basis point of P&L update in real time.',
    icon: 'trendingUp',
  },
]

export const plans = [
  {
    name: 'Starter',
    price: 0,
    description: 'Get in the game with the core trading toolkit.',
    highlighted: false,
    features: [
      'Portfolio up to $10,000',
      'Core AI trade signals',
      '3 watchlists',
      'Price + email alerts',
      'Mobile app access',
      'Community support',
    ],
    cta: 'Start Free',
  },
  {
    name: 'Silver',
    price: 29,
    description: 'For active traders who want a real edge.',
    highlighted: false,
    features: [
      'Portfolio up to $100,000',
      'Advanced AI signals',
      'Unlimited watchlists',
      'SMS + email alerts',
      'Priority support',
      'Performance analytics',
      'Tax-loss harvesting',
    ],
    cta: 'Start Free Trial',
  },
  {
    name: 'Gold',
    price: 79,
    description: 'Full firepower for serious, full-time traders.',
    highlighted: true,
    features: [
      'Unlimited portfolio size',
      'Premium AI trade signals',
      'Automated strategy rules',
      'Real-time risk controls',
      '24/7 dedicated support',
      'Options & derivatives',
      'Tax optimization suite',
      'All-market access',
    ],
    cta: 'Start Free Trial',
  },
  {
    name: 'Platinum',
    price: 199,
    description: 'Institutional-grade execution for elite desks.',
    highlighted: false,
    features: [
      'Everything in Gold',
      'Dedicated execution advisor',
      'Custom algo builder',
      'Full API access',
      'White-glove onboarding',
      'DeFi integration',
      'Prime brokerage access',
      'Family office tools',
    ],
    cta: 'Contact Sales',
  },
]

export const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Portfolio Manager',
    company: 'Independent',
    avatar: 'SM',
    image: 'https://i.pravatar.cc/80?img=47',
    color: '#E0241C',
    quote: 'The signals are a genuine edge. I\'m up 340% on a risk-adjusted basis in a year. I\'ve run Bloomberg and Refinitiv — nothing executes like this for the price.',
    profit: '+340%',
    period: '12 months',
    rating: 5,
  },
  {
    name: 'James Thornton',
    role: 'Day Trader',
    company: '15 years experience',
    avatar: 'JT',
    image: 'https://i.pravatar.cc/80?img=68',
    color: '#6366F1',
    quote: 'Fills are instant and the analytics are best-in-class. Fifteen years trading and this is the first platform that makes me faster AND sharper at the same time.',
    profit: '+187%',
    period: '8 months',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Tech Executive',
    company: 'Series B Startup',
    avatar: 'PS',
    image: 'https://i.pravatar.cc/80?img=45',
    color: '#F59E0B',
    quote: 'I set the automation and let it run. The book doubled in 8 months while I focused on my company. The engine just performs — zero babysitting required.',
    profit: '+218%',
    period: '8 months',
    rating: 5,
  },
  {
    name: 'Michael Reeves',
    role: 'Hedge Fund Analyst',
    company: 'Meridian Capital',
    avatar: 'MR',
    image: 'https://i.pravatar.cc/80?img=57',
    color: '#EC4899',
    quote: 'Institutional-grade execution at a retail price. We run Tesla Capital next to our Bloomberg terminals — the divergence signals are uniquely alpha-generating.',
    profit: '+412%',
    period: '18 months',
    rating: 5,
  },
]

export const securityFeatures = [
  {
    icon: 'lock',
    title: '256-bit AES Encryption',
    description: 'Bank-grade encryption on every byte, at rest and in transit.',
  },
  {
    icon: 'shield',
    title: 'FDIC Insured',
    description: 'Cash balances protected up to $500,000 through partner banks.',
  },
  {
    icon: 'fingerprint',
    title: 'Biometric Login',
    description: 'Face ID, Touch ID, and hardware security key support built in.',
  },
  {
    icon: 'eye',
    title: 'Real-Time Fraud Detection',
    description: 'AI watches every transaction and flags anomalies instantly.',
  },
  {
    icon: 'server',
    title: 'SOC 2 Type II Certified',
    description: 'Independently audited controls and infrastructure you can trust.',
  },
  {
    icon: 'globe',
    title: 'Regulated & Compliant',
    description: 'Registered with SEC, FINRA, and compliant across 140+ markets.',
  },
]

const SI = 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons'

export const portfolioAssets = [
  { symbol: 'AAPL', name: 'Apple Inc.',   price: 218.45, change: 2.34,  changePercent: 1.08,  allocation: 22, logo: `${SI}/apple.svg` },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 892.17, change: 18.92, changePercent: 2.16,  allocation: 18, logo: `${SI}/nvidia.svg` },
  { symbol: 'BTC',  name: 'Bitcoin',      price: 71_420, change: 1_243, changePercent: 1.77,  allocation: 15, logo: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png' },
  { symbol: 'MSFT', name: 'Microsoft',    price: 415.32, change: -3.21, changePercent: -0.77, allocation: 12, logo: `${SI}/microsoft.svg` },
  { symbol: 'ETH',  name: 'Ethereum',     price: 3_847,  change: 89.3,  changePercent: 2.38,  allocation: 10, logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
  { symbol: 'TSLA', name: 'Tesla Inc.',   price: 248.91, change: -5.47, changePercent: -2.15, allocation: 8,  logo: `${SI}/tesla.svg` },
]

export const chartData = [
  160, 155, 162, 158, 165, 170, 168, 175, 172, 180,
  178, 185, 190, 188, 195, 192, 200, 198, 205, 202,
  210, 208, 215, 212, 220, 218, 225, 228, 232, 238,
  235, 242, 248, 245, 252, 258, 255, 262, 268, 265,
]
