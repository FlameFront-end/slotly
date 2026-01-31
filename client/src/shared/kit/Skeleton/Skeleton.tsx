import SkeletonLib, { type SkeletonProps as LibSkeletonProps } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

// Dark theme colors matching app variables
const BASE_COLOR = '#2c2e33' // --bg-tertiary
const HIGHLIGHT_COLOR = '#3d4046' // Slightly lighter for shimmer

export interface SkeletonProps extends LibSkeletonProps {
	borderRadius?: string | number
}

export const Skeleton = ({ borderRadius = 8, duration = 1.5, ...props }: SkeletonProps) => (
	<SkeletonLib
		baseColor={BASE_COLOR}
		highlightColor={HIGHLIGHT_COLOR}
		borderRadius={borderRadius}
		duration={duration}
		{...props}
	/>
)
