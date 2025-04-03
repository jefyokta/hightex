<?php

test('saving document', function () {
    $response = $this->get('/');

    $response->assertStatus(200);
});
