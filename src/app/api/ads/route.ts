import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { randomBytes } from 'crypto';

// Generate unique ad reference ID
function generateAdReferenceId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = randomBytes(3).toString('hex').toUpperCase();
  return `AD-${timestamp}-${random}`;
}

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 100)
    .replace(/-+$/, '');
}

// GET - Fetch ads with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const condition = searchParams.get('condition');
    const q = searchParams.get('q');
    const featured = searchParams.get('featured');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sort = searchParams.get('sort') || 'newest';

    const skip = (page - 1) * limit;

    // Build filter conditions
    const where: any = {
      status: 'active',
    };

    if (category) {
      where.OR = [
        { category: { slug: category } },
        { subCategory: { slug: category } },
      ];
    }

    if (location) {
      where.OR = [
        { locationDivision: location },
        { locationDistrict: location },
        { locationArea: location },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (condition && ['new', 'used'].includes(condition)) {
      where.condition = condition;
    }

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    // Build sort
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'oldest') orderBy = { createdAt: 'asc' };
    else if (sort === 'price-low') orderBy = { price: 'asc' };
    else if (sort === 'price-high') orderBy = { price: 'desc' };

    // Get total count
    const total = await db.ad.count({ where });

    // Get ads
    const ads = await db.ad.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        images: {
          orderBy: { displayOrder: 'asc' },
        },
        category: {
          select: { nameEn: true, nameBn: true, slug: true },
        },
        user: {
          select: { id: true, fullName: true, role: true, isVerified: true },
        },
      },
    });

    return NextResponse.json({
      ads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching ads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ads' },
      { status: 500 }
    );
  }
}

// POST - Create new ad
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract form fields
    const categoryId = formData.get('categoryId') as string;
    const subCategoryId = formData.get('subCategoryId') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const isPriceNegotiable = formData.get('isPriceNegotiable') === 'true';
    const condition = formData.get('condition') as string;
    const locationDivision = formData.get('locationDivision') as string;
    const locationDistrict = formData.get('locationDistrict') as string;
    const locationArea = formData.get('locationArea') as string;
    const brand = formData.get('brand') as string;
    const model = formData.get('model') as string;
    
    // Boost options
    const boostTopAd = formData.get('boostTopAd') === 'true';
    const boostBumpUp = formData.get('boostBumpUp') === 'true';
    const boostUrgent = formData.get('boostUrgent') === 'true';
    const boostFeatured = formData.get('boostFeatured') === 'true';
    const coverPhotoIndex = parseInt(formData.get('coverPhotoIndex') as string) || 0;
    
    // Category-specific fields
    const categorySpecificFields: { key: string; value: string }[] = [];
    const specificFieldKeys = [
      'generation', 'cores', 'threads', 'baseClock', 'socket',
      'vram', 'memoryType', 'chipset', 'formFactor', 'capacity',
      'ramType', 'speed', 'storageType', 'interface', 'wattage',
      'efficiency', 'caseType', 'screenSize', 'resolution', 'refreshRate',
      'coolerType', 'switchType', 'keyboardLayout', 'dpi', 'audioType',
      'laptopBrand', 'laptopSpecs', 'networkType',
    ];
    
    specificFieldKeys.forEach(key => {
      const value = formData.get(key) as string;
      if (value) {
        categorySpecificFields.push({ key, value });
      }
    });

    // Extract photos
    const photos: { file: File; index: number }[] = [];
    let photoIndex = 0;
    while (true) {
      const photo = formData.get(`photo${photoIndex}`) as File | null;
      if (!photo || photoIndex > 10) break;
      if (photo instanceof File) {
        photos.push({ file: photo, index: photoIndex });
      }
      photoIndex++;
    }

    // Validate required fields
    if (!categoryId || !title || !description || isNaN(price) || !locationDivision || !locationDistrict) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // For demo purposes, we'll use a demo user ID
    // In production, you'd get this from the authenticated session
    let userId = 'demo-user-id';
    
    // Try to find or create a demo user
    const existingUser = await db.user.findUnique({
      where: { email: 'demo@partschai.com' }
    });
    
    if (!existingUser) {
      const newUser = await db.user.create({
        data: {
          email: 'demo@partschai.com',
          fullName: 'Demo User',
          role: 'user',
          isVerified: true,
        }
      });
      userId = newUser.id;
    } else {
      userId = existingUser.id;
    }

    // Generate unique IDs
    const adReferenceId = generateAdReferenceId();
    const slug = generateSlug(title) + '-' + Date.now().toString(36);

    // Create the ad
    const ad = await db.ad.create({
      data: {
        userId,
        categoryId,
        subCategoryId: subCategoryId !== categoryId ? subCategoryId : null,
        title,
        slug,
        description,
        price,
        isPriceNegotiable,
        condition: condition || 'used',
        locationDivision,
        locationDistrict,
        locationArea,
        adReferenceId,
        status: 'pending_review',
        isFeatured: boostFeatured,
        isUrgent: boostUrgent,
        isTopAd: boostTopAd,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    // Create ad attributes for category-specific fields
    if (brand || model || categorySpecificFields.length > 0) {
      const attributesData = [];
      
      if (brand) {
        attributesData.push({
          adId: ad.id,
          attributeKey: 'brand',
          attributeValue: brand,
        });
      }
      
      if (model) {
        attributesData.push({
          adId: ad.id,
          attributeKey: 'model',
          attributeValue: model,
        });
      }
      
      categorySpecificFields.forEach(({ key, value }) => {
        attributesData.push({
          adId: ad.id,
          attributeKey: key,
          attributeValue: value,
        });
      });
      
      if (attributesData.length > 0) {
        await db.adAttribute.createMany({
          data: attributesData,
        });
      }
    }

    // Create boost records if selected
    if (boostTopAd || boostBumpUp || boostUrgent || boostFeatured) {
      const boostsData = [];
      
      if (boostTopAd) {
        boostsData.push({
          adId: ad.id,
          userId,
          boostType: 'top_ad',
          isActive: true,
          endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        });
      }
      
      if (boostBumpUp) {
        boostsData.push({
          adId: ad.id,
          userId,
          boostType: 'bump_up',
          isActive: true,
        });
      }
      
      if (boostUrgent) {
        boostsData.push({
          adId: ad.id,
          userId,
          boostType: 'urgent',
          isActive: true,
          endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
      }
      
      if (boostFeatured) {
        boostsData.push({
          adId: ad.id,
          userId,
          boostType: 'featured',
          isActive: true,
          endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
      }
      
      if (boostsData.length > 0) {
        await db.adBoost.createMany({
          data: boostsData,
        });
      }
    }

    // Create image records (for demo, we'll store placeholder URLs)
    // In production, you'd upload to cloud storage and get real URLs
    if (photos.length > 0) {
      const imagesData = photos.map((photo, index) => ({
        adId: ad.id,
        // In production, this would be the uploaded URL
        imageUrl: `/uploads/${ad.id}/${photo.index}-${photo.file.name}`,
        displayOrder: index,
        isPrimary: index === coverPhotoIndex,
      }));
      
      await db.adImage.createMany({
        data: imagesData,
      });
    }

    return NextResponse.json({
      success: true,
      adId: ad.id,
      adReferenceId: ad.adReferenceId,
      message: 'Ad submitted successfully',
    });
  } catch (error) {
    console.error('Error creating ad:', error);
    return NextResponse.json(
      { error: 'Failed to create ad' },
      { status: 500 }
    );
  }
}
