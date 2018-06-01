varying float noise;

void main() {
    gl_FragColor = vec4(1.1 - 2.5 * noise, 0., 0., 1.);
}
