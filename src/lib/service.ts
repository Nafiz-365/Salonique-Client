import type { ApiService } from "@/lib/server-api";
import type { Service } from "@/lib/types";

export function mapApiServiceToService(apiService: ApiService): Service {
    return {
        id: apiService._id,
        name: apiService.name,
        slug: apiService.slug,
        category: apiService.category as Service["category"],
        price: apiService.price,
        duration: apiService.duration,
        rating: apiService.rating,
        reviewCount: apiService.reviewCount,
        description: apiService.description,
        shortDescription: apiService.shortDescription,
        image: apiService.image,
        gallery: apiService.gallery,
        isActive: apiService.isActive,
        featured: apiService.featured,
        popular: apiService.popular,
        specialist: apiService.specialist,
        location: apiService.location,
        included: apiService.included,
    };
}
