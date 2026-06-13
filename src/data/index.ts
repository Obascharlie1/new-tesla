export const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Markets', href: '#dashboard' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Security', href: '#security' },
]

export const stats = [
  { label: 'Active Investors', value: 10_400_000, suffix: '+', prefix: '' },
  { label: 'Trading Volume', value: 48, suffix: 'B+', prefix: '$' },
  { label: 'Countries', value: 140, suffix: '+', prefix: '' },
  { label: 'Platform Uptime', value: 99.97, suffix: '%', prefix: '' },
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
    title: 'AI Market Intelligence',
    description: 'Proprietary machine learning models analyze millions of data points to surface high-conviction trade signals before the market reacts.',
    tag: 'AI-Powered',
  },
  {
    icon: 'pieChart',
    title: 'Smart Portfolio Management',
    description: 'Automated rebalancing, tax-loss harvesting, and dynamic allocation keep your portfolio optimized around the clock.',
    tag: 'Automated',
  },
  {
    icon: 'activity',
    title: 'Real-Time Analytics',
    description: 'Sub-millisecond market data feeds, customizable dashboards, and institutional-grade charting tools in one unified interface.',
    tag: 'Live Data',
  },
  {
    icon: 'zap',
    title: 'Automated Investing',
    description: 'Set rules-based strategies and let the platform execute with precision — DCA, momentum, mean reversion, and custom algorithms.',
    tag: 'Hands-Free',
  },
  {
    icon: 'shield',
    title: 'Advanced Risk Management',
    description: 'Real-time VaR analysis, stop-loss automation, and portfolio stress-testing protect your capital in volatile markets.',
    tag: 'Protected',
  },
  {
    icon: 'globe',
    title: 'Multi-Market Access',
    description: 'Trade equities, ETFs, options, crypto, forex, and commodities from a single unified account with competitive fees.',
    tag: 'All Assets',
  },
]

export const howItWorksSteps = [
  {
    step: '01',
    title: 'Create Your Account',
    description: 'Sign up in under 2 minutes. Verify your identity, connect your bank, and you\'re ready to invest with institutional-grade tools.',
    icon: 'userPlus',
  },
  {
    step: '02',
    title: 'Deposit Funds',
    description: 'Fund your account via bank transfer, wire, or crypto. Funds are FDIC-insured up to $500,000 and available to invest instantly.',
    icon: 'creditCard',
  },
  {
    step: '03',
    title: 'Start Building Wealth',
    description: 'Choose from AI-recommended portfolios or build your own. Set automation rules and watch your portfolio grow with real-time insights.',
    icon: 'trendingUp',
  },
]

export const plans = [
  {
    name: 'Starter',
    price: 0,
    description: 'Everything you need to start investing smarter.',
    highlighted: false,
    features: [
      'Portfolio up to $10,000',
      'Basic AI market signals',
      '3 watchlists',
      'Email alerts',
      'Mobile app access',
      'Community support',
    ],
    cta: 'Get Started Free',
  },
  {
    name: 'Silver',
    price: 29,
    description: 'For active investors seeking an edge.',
    highlighted: false,
    features: [
      'Portfolio up to $100,000',
      'Advanced AI insights',
      'Unlimited watchlists',
      'SMS + email alerts',
      'Priority support',
      'Portfolio analytics',
      'Tax-loss harvesting',
    ],
    cta: 'Start Free Trial',
  },
  {
    name: 'Gold',
    price: 79,
    description: 'The complete platform for serious investors.',
    highlighted: true,
    features: [
      'Unlimited portfolio size',
      'Premium AI trading signals',
      'Automated investing rules',
      'Real-time risk management',
      '24/7 dedicated support',
      'Advanced derivatives',
      'Tax optimization suite',
      'All market access',
    ],
    cta: 'Start Free Trial',
  },
  {
    name: 'Platinum',
    price: 199,
    description: 'Institutional-grade tools for elite investors.',
    highlighted: false,
    features: [
      'Everything in Gold',
      'Dedicated portfolio advisor',
      'Custom algorithm builder',
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
    quote: 'Tesla Capital\'s AI signals are genuinely remarkable. My risk-adjusted returns are up 340% over 12 months. I\'ve used Bloomberg, Refinitiv — nothing comes close for the price.',
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
    quote: 'The real-time analytics and automated execution are best-in-class. I\'ve been trading for 15 years and this is the first platform that genuinely saves me time while improving my results.',
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
    quote: 'I had no time to actively manage investments. The automated portfolio doubled in 8 months while I focused on my company. The AI just works. Incredibly trustworthy platform.',
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
    quote: 'Institutional-quality analytics at a fraction of the cost. We use Tesla Capital alongside our Bloomberg terminals. The AI divergence signals are uniquely alpha-generating.',
    profit: '+412%',
    period: '18 months',
    rating: 5,
  },
]

export const securityFeatures = [
  {
    icon: 'lock',
    title: '256-bit AES Encryption',
    description: 'Military-grade encryption for all data at rest and in transit.',
  },
  {
    icon: 'shield',
    title: 'FDIC Insured',
    description: 'Cash balances insured up to $500,000 through partner banks.',
  },
  {
    icon: 'fingerprint',
    title: 'Biometric Authentication',
    description: 'Face ID, Touch ID, and hardware security key support.',
  },
  {
    icon: 'eye',
    title: 'Real-Time Fraud Detection',
    description: 'AI-powered anomaly detection monitors every transaction.',
  },
  {
    icon: 'server',
    title: 'SOC 2 Type II Certified',
    description: 'Independently audited security controls and infrastructure.',
  },
  {
    icon: 'globe',
    title: 'Regulated & Compliant',
    description: 'Registered with SEC, FINRA, and regulated in 140+ countries.',
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
