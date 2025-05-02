import {Lock, Shield, Globe} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";


function Home() {
    const [url, setUrl] = useState('');
    const [scanStatus, setScanStatus] = useState('idle');
    const navigate = useNavigate();

    function notify(message: string) {
        toast(message)
    }


    async function handleScan(e: React.FormEvent) {
        e.preventDefault();
        setScanStatus('scanning');
        const scanUrl =  url? new URL(url).hostname: null;
        console.log(scanUrl)
        try {
            const apiURL = `http://localhost:3000/web/scan/${scanUrl}`
            const response = await fetch(apiURL, {
                method: "POST"
            })
    
            const data = await response.json();
            
            if(!data.success) {
                return notify("Scanning failed!")
            }

            navigate(`/full-report/${scanUrl}`)
        } catch(error) {
            notify("Scanning failed.")
            console.log(error)
        }

        // onScanComplete();
    };

    return (
        <div className="container mx-auto px-4 pt-20 pb-12 text-center">
            <div className="flex justify-center mb-12">
                <div className="relative w-40 h-40 animate-pulse">
                    <Shield className="w-full h-full text-[#00AAFF] opacity-20" strokeWidth={1.5} />
                    <Lock
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 text-[#00AAFF]"
                        strokeWidth={1.5}
                    />
                </div>
            </div>

            <div className="max-w-4xl mx-auto">
                <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-[#00AAFF] to-[#00FFE0] text-transparent bg-clip-text">
                    WEBSITE SECURITY SCANNER
                </h1>
                <p className="text-2xl text-gray-400 mb-16 leading-relaxed">
                    Check your website for security vulnerabilities and threats.
                </p>

                <form onSubmit={handleScan} className="max-w-3xl mx-auto">
                    <div className="bg-[#001219]/90 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-[#00AAFF]/10 shadow-[#00AAFF]/5">
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1">
                                <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#00AAFF]/50" size={24} />
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://www.example.com"
                                    className="w-full bg-[#000913] text-white placeholder-gray-500 pl-14 pr-6 py-5 rounded-xl border border-[#00AAFF]/20 focus:outline-none focus:border-[#00AAFF] focus:ring-2 focus:ring-[#00AAFF]/20 transition-all duration-200"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={scanStatus === 'scanning'}
                                className="bg-[#00AAFF] text-white px-10 py-5 rounded-xl font-semibold hover:bg-[#0088CC] transition-all duration-200 disabled:opacity-50 disabled:hover:bg-[#00AAFF] shadow-lg shadow-[#00AAFF]/20 hover:shadow-xl hover:shadow-[#00AAFF]/30"
                            >
                                {scanStatus === 'scanning' ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        Scanning...
                                    </span>
                                ) : (
                                    'Scan Website'
                                )}
                            </button>
                        </div>
                    </div>
                </form>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-3xl mx-auto">
                    {[
                        {
                            title: 'Real-time Scanning',
                            description: 'Instant vulnerability detection with continuous monitoring.',
                        },
                        {
                            title: 'Comprehensive Analysis',
                            description: 'Deep inspection of security threats and weaknesses.',
                        },
                        {
                            title: 'Detailed Reports',
                            description: 'Get actionable insights with detailed security reports.',
                        },
                    ].map((feature, index) => (
                        <div
                            key={index}
                            className="bg-[#001219]/50 backdrop-blur-sm rounded-xl p-6 border border-[#00AAFF]/10 hover:border-[#00AAFF]/20 transition-colors"
                        >
                            <h3 className="text-[#00AAFF] font-semibold mb-2">{feature.title}</h3>
                            <p className="text-gray-400">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}


export default Home;