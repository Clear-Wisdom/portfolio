import { useEffect, useRef, useState } from "react";

const GradientPressureText = ({
    text = "Randy's.",
    colors = ["#3b82f6", "#9333ea", "#40ffaa", "#4079ff", "#3b82f6"],
    animationSpeed = 6,

    width = true,
    weight = true,
    italic = false,

    minFontSize = 120,
    className = "",
}) => {
    const containerRef = useRef(null);
    const titleRef = useRef(null);
    const spansRef = useRef([]);

    const mouseRef = useRef({ x: 0, y: 0 });
    const cursorRef = useRef({ x: 0, y: 0 });

    const [fontSize, setFontSize] = useState(minFontSize);

    const chars = text.split("");

    const dist = (a, b) => {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        return Math.sqrt(dx * dx + dy * dy);
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            cursorRef.current.x = e.clientX;
            cursorRef.current.y = e.clientY;
        };

        window.addEventListener("mousemove", handleMouseMove);

        // 초기 마우스 위치를 화면 밖으로 설정하여 pressure 효과가 적용되지 않도록 함
        mouseRef.current.x = -9999;
        mouseRef.current.y = -9999;
        cursorRef.current.x = -9999;
        cursorRef.current.y = -9999;

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    useEffect(() => {
        const setSize = () => {
            setFontSize(minFontSize);
        };

        setSize();
        window.addEventListener("resize", setSize);
        return () => window.removeEventListener("resize", setSize);
    }, [minFontSize]);

    useEffect(() => {
        let rafId;
        const animate = () => {
            mouseRef.current.x +=
                (cursorRef.current.x - mouseRef.current.x) / 15;
            mouseRef.current.y +=
                (cursorRef.current.y - mouseRef.current.y) / 15;

            if (titleRef.current) {
                const titleRect = titleRef.current.getBoundingClientRect();
                const maxDist = titleRect.width / 2;

                spansRef.current.forEach((span) => {
                    if (!span) return;

                    const rect = span.getBoundingClientRect();
                    const charCenter = {
                        x: rect.x + rect.width / 2,
                        y: rect.y + rect.height / 2,
                    };

                    const d = dist(mouseRef.current, charCenter);

                    const getAttr = (distance, minVal, maxVal) => {
                        const val =
                            maxVal - Math.abs((maxVal * distance) / maxDist);
                        return Math.max(minVal, val + minVal);
                    };

                    const wdth = width ? Math.floor(getAttr(d, 75, 125)) : 100;
                    const wght = weight
                        ? Math.floor(getAttr(d, 400, 900))
                        : 700;
                    const italVal = italic ? getAttr(d, 0, 1).toFixed(2) : 0;

                    span.style.fontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;
                });
            }

            rafId = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(rafId);
    }, [width, weight, italic, chars.length]);

    return (
        <div
            ref={containerRef}
            className={`relative ${className}`}
        >
            <h1
                ref={titleRef}
                className="text-[120px] md:text-[180px] lg:text-[240px] font-bold flex justify-center"
                style={{
                    backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
                    backgroundSize: "300% 100%",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    animation: `gradient ${animationSpeed}s linear infinite`,
                    margin: 0,
                    fontVariationSettings: "'wght' 700, 'wdth' 100",
                }}
            >
                {chars.map((char, i) => (
                    <span
                        key={i}
                        ref={(el) => (spansRef.current[i] = el)}
                        className="inline-block"
                        style={{
                            transition: "font-variation-settings 0.1s ease-out",
                        }}
                    >
                        {char}
                    </span>
                ))}
            </h1>
        </div>
    );
};

export default GradientPressureText;
