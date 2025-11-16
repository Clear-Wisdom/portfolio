import { useState, useEffect, useRef, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import CardNav from "./components/CardNav";
import MarkdownRenderer from "./components/MarkdownRenderer";
import GradientPressureText from "./components/GradientPressureText";
import Lanyard from "./components/Lanyard";

// 마크다운 파일 임포트
import aboutMd from "./content/about.md?raw";
import projectsMd from "./content/projects.md?raw";
import contactMd from "./content/contact.md?raw";

function Portfolio() {
    const [isMenuVisible, setIsMenuVisible] = useState(true);
    const [forceCloseMenu, setForceCloseMenu] = useState(false);
    const titleRef = useRef(null);
    const navRef = useRef(null);
    const hintRef = useRef(null);
    const navigate = useNavigate();
    const navigateRef = useRef(navigate);
    const location = useLocation();
    const prevLocationRef = useRef(location.pathname);

    useEffect(() => {
        navigateRef.current = navigate;
    }, [navigate]);

    useEffect(() => {
        // 홈페이지에서만 초기 애니메이션 실행
        if (location.pathname === "/") {
            const tl = gsap.timeline();

            // 타이틀 먼저 표시
            if (titleRef.current) {
                tl.fromTo(
                    titleRef.current,
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
                );
            }

            // 메뉴바가 하늘에서 천천히 내려오며 착지
            tl.fromTo(
                navRef.current,
                { opacity: 0, y: -100 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: "power2.out",
                },
                "-=0.3" // 타이틀 애니메이션과 약간 겹치게
            );

            return () => {
                tl.kill();
            };
        } else {
            // 다른 페이지에서는 메뉴바를 즉시 표시
            if (navRef.current) {
                gsap.set(navRef.current, { opacity: 1, y: 0 });
            }
        }
    }, [location.pathname]);

    // 경로 변경 시 메뉴 자동으로 닫기
    useEffect(() => {
        if (prevLocationRef.current !== location.pathname) {
            setForceCloseMenu(true);
            // forceClose를 즉시 false로 되돌려서 다음 변경을 감지할 수 있게 함
            setTimeout(() => setForceCloseMenu(false), 100);
            prevLocationRef.current = location.pathname;
        }
    }, [location.pathname]);

    const handleHideMenu = () => {
        // 메뉴바를 위로 사라지게
        gsap.to(navRef.current, {
            opacity: 0,
            y: -100,
            duration: 0.8,
            ease: "power2.in",
            onComplete: () => {
                setIsMenuVisible(false);

                // 힌트 메시지 표시
                gsap.fromTo(
                    hintRef.current,
                    { opacity: 0, y: 10 },
                    { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
                );

                // 3초 후 힌트 메시지 서서히 사라지기
                gsap.to(hintRef.current, {
                    opacity: 0,
                    duration: 2,
                    delay: 3,
                    ease: "power2.inOut",
                });
            },
        });
    };

    const handleShowMenu = () => {
        if (!isMenuVisible) {
            setIsMenuVisible(true);

            // 힌트 메시지 즉시 숨기기
            gsap.to(hintRef.current, { opacity: 0, duration: 0.3 });

            // 메뉴바를 다시 하늘에서 내려오게
            gsap.fromTo(
                navRef.current,
                { opacity: 0, y: -100 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: "power2.out",
                }
            );
        }
    };

    const menuItems = useMemo(
        () => [
            {
                label: "About Me",
                bgColor: "#e0f2fe",
                textColor: "#0c4a6e",
                onClick: () => navigateRef.current("/aboutme"),
                links: [
                    { label: "Self introduction" },
                    { label: "Skills" },
                ],
            },
            {
                label: "Projects",
                bgColor: "#fce7f3",
                textColor: "#831843",
                onClick: () => navigateRef.current("/projects"),
                links: [
                    { label: "Projects / Activities" },
                    { label: "Year-by-year" },
                ],
            },
            {
                label: "Contact",
                bgColor: "#fef3c7",
                textColor: "#78350f",
                onClick: () => navigateRef.current("/contact"),
                links: [
                    { label: "Email" },
                    { label: "GitHub" },
                ],
            },
        ],
        []
    );

    // 현재 경로에 따라 콘텐츠 결정
    const getContent = () => {
        switch (location.pathname) {
            case "/aboutme":
                return aboutMd;
            case "/projects":
                return projectsMd;
            case "/contact":
                return contactMd;
            default:
                return null;
        }
    };

    const content = getContent();

    return (
        <div
            className="min-h-screen"
            onClick={handleShowMenu}
        >
            {/* CardNav 메뉴 - 최상단 고정 */}
            <div
                ref={navRef}
                className={`fixed top-0 left-0 right-0 z-50 ${location.pathname === "/" ? "opacity-0" : ""}`}
            >
                <CardNav
                    logoAlt="Portfolio"
                    items={menuItems}
                    baseColor="#ffffff"
                    menuColor="#1f2937"
                    buttonBgColor="#3b82f6"
                    buttonTextColor="#ffffff"
                    onHideClick={handleHideMenu}
                    onLogoClick={() => navigate("/")}
                    forceClose={forceCloseMenu}
                />
            </div>

            {/* 힌트 메시지 */}
            <div
                ref={hintRef}
                className="fixed top-24 left-1/2 -translate-x-1/2 z-40 opacity-0 pointer-events-none"
            >
                <p className="text-gray-800 text-lg">
                    Click anywhere to see menu bar again
                </p>
            </div>

            {/* 큰 타이틀 - 홈에서만 표시 */}
            {location.pathname === "/" && (
                <div
                    ref={titleRef}
                    className="flex items-center justify-center h-screen"
                >
                    <GradientPressureText
                        text="Randy's."
                        colors={[
                            "#3b82f6",
                            "#9333ea",
                            "#40ffaa",
                            "#4079ff",
                            "#3b82f6",
                        ]}
                        animationSpeed={6}
                        width={true}
                        weight={true}
                        italic={false}
                        minFontSize={120}
                    />
                </div>
            )}

            {/* About Me 페이지에서만 Lanyard 표시 */}
            {location.pathname === "/aboutme" && <Lanyard />}

            {/* 메인 콘텐츠 - 라우트에 따라 표시 */}
            {content && (
                <main className={`max-w-4xl mx-auto px-4 py-24 ${location.pathname === "/aboutme" ? "mt-[500px]" : "mt-20"}`}>
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8">
                        <MarkdownRenderer content={content} />
                    </div>
                </main>
            )}
        </div>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/*" element={<Portfolio />} />
            </Routes>
        </Router>
    );
}

export default App;
