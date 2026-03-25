import { useState, useEffect } from 'react';
import { getGPUTier } from 'detect-gpu';

export type GPUQuality = 'low' | 'medium' | 'high';

export function useGPUQuality() {
    const [quality, setQuality] = useState<GPUQuality>('medium');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkGPU() {
            try {
                const gpuTier = await getGPUTier();

                // Tier 1 -> Low (Mobile/Old Intel)
                // Tier 2 -> Medium (Mid-range)
                // Tier 3+ -> High (Dedicated GPU)
                if (gpuTier.tier === 1) {
                    setQuality('low');
                } else if (gpuTier.tier === 2) {
                    setQuality('medium');
                } else {
                    setQuality('high');
                }
            } catch {
                console.warn('GPU detection failed, defaulting to medium quality');
                setQuality('medium');
            } finally {
                setLoading(false);
            }
        }

        checkGPU();
    }, []);

    return { quality, loading };
}
