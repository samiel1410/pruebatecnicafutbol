<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$file = 'jugadores.json';

if (!file_exists($file)) {
    file_put_contents($file, '[]');
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo file_get_contents($file);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (isset($data['nombre']) && isset($data['numero']) && isset($data['categoria']) && isset($data['sede'])) {
        $jugadores = json_decode(file_get_contents($file), true);
        
        $nuevo = [
            'codigo' => strval(count($jugadores) + 100), // ID generado rápido
            'nombre' => $data['nombre'],
            'numero' => $data['numero'],
            'categoria' => $data['categoria'],
            'sede' => $data['sede']
        ];
        
        $jugadores[] = $nuevo;
        file_put_contents($file, json_encode($jugadores, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        
        echo json_encode(['success' => true, 'jugador' => $nuevo]);
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Datos incompletos']);
    }
    exit();
}
