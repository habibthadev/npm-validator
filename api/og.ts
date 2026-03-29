import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request): Promise<ImageResponse> {
  const { searchParams } = new URL(req.url);
  
  const title = searchParams.get('title')?.slice(0, 100) ?? 'Is your package name taken?';
  const subtitle = searchParams.get('subtitle')?.slice(0, 200) ?? 'Validate npm naming rules, check registry availability, and detect typosquatting risk.';

  const [regularFont, semiboldFont, boldFont] = await Promise.all([
    fetch('https://github.com/sahibjotsaggu/San-Francisco-Pro-Fonts/raw/master/SF-Pro-Display-Regular.otf').then(res => res.arrayBuffer()),
    fetch('https://github.com/sahibjotsaggu/San-Francisco-Pro-Fonts/raw/master/SF-Pro-Display-Semibold.otf').then(res => res.arrayBuffer()),
    fetch('https://github.com/sahibjotsaggu/San-Francisco-Pro-Fonts/raw/master/SF-Pro-Display-Bold.otf').then(res => res.arrayBuffer()),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: '#f2f2f7',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'SF Pro Display, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 60,
            left: 60,
            width: 56,
            height: 56,
            background: '#007aff',
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="40" height="40" viewBox="0 0 40 40">
            <path d="M10 20h20M20 10v20" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
          </svg>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 40 }}>
          <h1 style={{ fontSize: 64, fontWeight: 700, margin: 0, color: '#000000', letterSpacing: '-0.02em' }}>
            {title}
          </h1>
          <p style={{ fontSize: 28, fontWeight: 400, margin: '20px 0 0 0', color: 'rgba(60, 60, 67, 0.6)', letterSpacing: '-0.01em', textAlign: 'center', maxWidth: '900px' }}>
            {subtitle}
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            width: 600,
            height: 56,
            background: 'rgba(118, 118, 128, 0.12)',
            borderRadius: 12,
            alignItems: 'center',
            paddingLeft: 20,
            paddingRight: 10,
            marginBottom: 36,
          }}
        >
          <span style={{ fontSize: 18, color: 'rgba(60, 60, 67, 0.3)', flex: 1, marginLeft: 36 }}>
            Enter package name...
          </span>
          <div
            style={{
              background: '#007aff',
              borderRadius: 10,
              padding: '10px 20px',
              fontSize: 15,
              fontWeight: 600,
              color: '#ffffff',
            }}
          >
            Check
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(52, 199, 89, 0.12)',
              borderRadius: 8,
              padding: '8px 16px',
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                background: '#34c759',
                marginRight: 12,
              }}
            />
            <span style={{ fontSize: 20, fontWeight: 500 }}>Syntax Check</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(0, 122, 255, 0.12)',
              borderRadius: 8,
              padding: '8px 16px',
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                background: '#007aff',
                marginRight: 12,
              }}
            />
            <span style={{ fontSize: 20, fontWeight: 500 }}>Registry Check</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 149, 0, 0.12)',
              borderRadius: 8,
              padding: '8px 16px',
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                background: '#ff9500',
                marginRight: 12,
              }}
            />
            <span style={{ fontSize: 20, fontWeight: 500 }}>Similarity Check</span>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: 60,
            fontSize: 16,
            color: 'rgba(60, 60, 67, 0.6)',
          }}
        >
          npm-validator.vercel.app
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 60,
            fontSize: 14,
            color: 'rgba(60, 60, 67, 0.4)',
          }}
        >
          by habibthadev.tech
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'SF Pro Display',
          data: regularFont,
          weight: 400,
          style: 'normal',
        },
        {
          name: 'SF Pro Display',
          data: semiboldFont,
          weight: 600,
          style: 'normal',
        },
        {
          name: 'SF Pro Display',
          data: boldFont,
          weight: 700,
          style: 'normal',
        },
      ],
    }
  );
}
