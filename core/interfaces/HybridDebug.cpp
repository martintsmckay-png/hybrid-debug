#include "HybridDebug.hpp"
#include "raymath.h"
#include "rlgl.h"
#include <cstdlib>

// ---------------- Configuration ----------------

float ParticleConfig::density = 0.4f;
float ParticleConfig::butter  = 0.7f;

// ---------------- Internal State ----------------

namespace {
    Shader pastryShader{};
    Texture2D particleTexture{};
    bool initialized = false;

    std::vector<DebugFrame> sampleCallstack() {
        return {
            {"update", "engine.cpp", 42},
            {"render", "engine.cpp", 84}
        };
    }

    void renderParticles() {
        if (!initialized) return;

        BeginShaderMode(pastryShader);
        int count = static_cast<int>(ParticleConfig::density * 100);

        for (int i = 0; i < count; ++i) {
            int x = GetRandomValue(0, GetScreenWidth());
            int y = GetRandomValue(0, GetScreenHeight());
            DrawTexture(particleTexture, x, y, WHITE);
        }

        EndShaderMode();
    }
}

// ---------------- VisualDebug ----------------

void VisualDebug::init() noexcept {
    pastryShader = LoadShader(nullptr, "pastry_shader.fs");
    particleTexture = LoadTexture("particle.png");

    updateShaderUniforms();
    initialized = true;
}

void VisualDebug::beginFrame() noexcept {
    // Reset telemetry if needed
}

void VisualDebug::renderHUD() noexcept {
    if (ParticleConfig::density > 0.0f) {
        renderParticles();
    }

    DrawText("Debug HUD", 10, 10, 20, WHITE);
}

void VisualDebug::setParticleDensity(float density) noexcept {
    if (density < 0.0f) density = 0.0f;
    if (density > 1.0f) density = 1.0f;
    ParticleConfig::density = density;
}

void VisualDebug::updateShaderUniforms() noexcept {
    if (!initialized) return;

    int loc = GetShaderLocation(pastryShader, "butterRatio");
    SetShaderValue(pastryShader, loc, &ParticleConfig::butter, SHADER_UNIFORM_FLOAT);
}

// ---------------- MetricSystem ----------------

MetricSystem::FrameAnalysis MetricSystem::captureMetrics() noexcept {
    FrameAnalysis result;
    result.callstack = sampleCallstack();
    result.recursionCost = 3.14f;

    float t = static_cast<float>(GetTime());
    result.timelineEvent = fmod(t, 37.0f) < 0.01f;

    return result;
}

void MetricSystem::logAnalysis(const FrameAnalysis& results) noexcept {
    TraceLog(LOG_INFO, "MetricSystem: Frame analysis event");
    TraceLog(LOG_INFO, TextFormat("  recursionCost = %.3f", results.recursionCost));
    TraceLog(LOG_INFO, TextFormat("  callstack depth = %d", (int)results.callstack.size()));
}

// ---------------- CrashHandler ----------------

namespace {
    int crashCount = 0;
}

void CrashHandler::monitorCrashes() noexcept {
    if (crashCount++ > 3) {
        TraceLog(LOG_WARNING, "CrashHandler: anomaly threshold exceeded");
        crashCount = 0;
    }
}

void CrashHandler::enableLiveLogging() noexcept {
    TraceLog(LOG_INFO, "CrashHandler: live logging enabled");
}
