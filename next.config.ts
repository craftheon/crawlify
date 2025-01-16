import type { NextConfig } from "next";
import { withPayload } from '@payloadcms/next/withPayload';

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: false
  },
};

export default withPayload(nextConfig);
