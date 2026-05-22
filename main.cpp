#include "raylib.h"
#include "HybridDebug.hpp"

// Window configuration
static const int SCREEN_WIDTH  = 800;
static const int SCREEN_HEIGHT = 450;

int main() {
    // Initialize Raylib window
    InitWindow(SCREEN_WIDTH, SCREEN_HEIGHT, "Hybrid Debug Demo");
    SetTargetFPS(60);

    // Initialize your debug system
    VisualDebug::init();
    CrashHandler::enableLiveLogging();

    while (!WindowShouldClose()) {
        // --- Update Phase ---
        debugFrameUpdate();  // runs metrics + HUD + crash monitor

        // --- Draw Phase ---
        BeginDrawing();
        ClearBackground(BLACK);

        DrawText("Hybrid Debug System Active", 10, 40, 20, GREEN);

        EndDrawing();
    }

    CloseWindow();
    return 0;
}
