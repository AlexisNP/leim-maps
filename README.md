# Leim Maps
🗺️ A simple Astro static site to display custom maps with Leaflet. Includes sample images with maps from my own world.

## Features
* Add your own markers for cities, NPCs, or quests
* Search through markers
* Create multiple maps for different continents or countries
* Measure distances between two points
* Custom client-side markers

## Documentation
### Making usable map assets
Since we're not using earth maps, we need to build one compatible with Leaflet. I used Zoomify to generate usable tile data from my SVG maps. I don't know if this will fit your use case ; if you use something else, you can contact me !

> [!IMPORTANT]
> As of writing this, it appears Zoomify Unlimited Converter (which is what I used) is not available on Linux or for download anymore

### Enabling features
Some features are able to be toggled on and off. If you don't use multiple languages, or if you don't want the custom markers, you can disable them in the .env file. By default, all of them are true.

## Contributing
I'm not currently accepting pull-requests for this project, but if you have a suggestion, feel free to contact me !

## Notes
As someone with some degree of with [aphantasia](https://en.wikipedia.org/wiki/Aphantasia), I struggle with visualization and immersion, and DMing in general. If you find yourself in the same situation, I hope my little thing made your life easier !
