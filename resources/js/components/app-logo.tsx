import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-2.5">
            <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-neutral-900 shadow-sm transition-transform hover:scale-105">
                <AppLogoIcon className="size-5" />
            </div>
            <div className="flex flex-col text-left">
                <span className="font-bold tracking-tight text-neutral-900 text-sm sm:text-base dark:text-white">
                    PRINTWITHDWARKESH
                </span>
                <span className="text-[10px] font-medium uppercase tracking-widest text-rose-600 -mt-1">
                    Custom Print Studio
                </span>
            </div>
        </div>
    );
}
